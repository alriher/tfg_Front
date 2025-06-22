import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getBookingsByUserIdPaginated,
  cancelBooking,
  updateBooking,
  getBookingsBySpaceIdAndDate,
} from "../services/BookingService";
import { IBooking } from "../interfaces/booking";
import {
  Button,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  DatePicker,
  Select,
  SelectItem,
  Divider,
} from "@nextui-org/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CalendarDate, today } from "@internationalized/date";
import { schedule } from "../assets/schedules";
import { isAfterOrEqualToday, isBeforeValidation } from "../services/ValidationService";
import { getErrorMessage } from "../services/ErrorServices";
import moment from "moment";
import SpaceCard from "./SpaceCard";

export default function AdminUserBookingsComponent() {
  const { userId } = useParams();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [bookingToCancel, setBookingToCancel] = useState<IBooking | null>(null);
  const [bookingToEdit, setBookingToEdit] = useState<IBooking | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editModal = useDisclosure();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Formulario para editar
  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    trigger: triggerEdit,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      entryDate: today("Europe/Madrid").add({ days: 1 }),
      schedule: "",
      assistants: "1",
    },
  });
  const editSelectedSchedule = useWatch({
    control: editControl,
    name: "schedule",
  });
  const entryDate = useWatch({ control: editControl, name: "entryDate" });
  const [editFullSchedules, setEditFullSchedules] = useState<string[]>([]);
  const editAssistantsPerHourRef = React.useRef<{ [key: string]: number }>({});
  const [editMaxAssistants, setEditMaxAssistants] = useState(1);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getBookingsByUserIdPaginated(Number(userId), page, pageSize).then((res) => {
        if (Array.isArray(res)) {
          setBookings(res);
          setTotal(res.length);
        } else {
          setBookings(res.bookings || []);
          setTotal(res.total || 0);
        }
        setLoading(false);
      });
    }
  }, [userId, page, pageSize]);

  // Cargar reservas ocupadas para la fecha seleccionada en el modal de edición
  const loadEditBookingsForDate = async (date: CalendarDate) => {
    if (
      bookingToEdit &&
      (bookingToEdit.Space || bookingToEdit.spaceId) &&
      date
    ) {
      const space = bookingToEdit.Space ?? bookingToEdit.spaceId;
      const dateStr = `${date.year}-${String(date.month).padStart(
        2,
        "0"
      )}-${String(date.day).padStart(2, "0")}`;
      const reservas = await getBookingsBySpaceIdAndDate(space.id, dateStr);
      const assistantsPerHour: { [key: string]: number } = {};
      reservas.forEach((r: IBooking) => {
        if (r.id === bookingToEdit.id) return;
        const start = moment(r.dateStart).format("HH:mm");
        const end = moment(r.dateEnd).format("HH:mm");
        const scheduleValue = `${start}-${end}`;
        const scheduleKey = schedule.find((s) => s.value === scheduleValue)?.key;
        if (scheduleKey) {
          assistantsPerHour[scheduleKey] =
            (assistantsPerHour[scheduleKey] || 0) + (r.assistants || 1);
        }
      });
      editAssistantsPerHourRef.current = assistantsPerHour;
      const full = Object.entries(assistantsPerHour)
        .filter(([_, count]) => count >= space.capacity)
        .map(([key]) => key);
      setEditFullSchedules(full);
    }
  };

  // Limpiar asistentes cada vez que cambie la hora en el modal de edición
  useEffect(() => {
    if (editModal.isOpen) {
      setEditValue("assistants", "");
    }
  }, [editSelectedSchedule, editModal.isOpen]);

  // Limpiar horario y asistentes cada vez que cambie la fecha en el modal de edición
  useEffect(() => {
    if (editModal.isOpen) {
      setEditValue("schedule", "");
      setEditValue("assistants", "");
    }
  }, [entryDate, editModal.isOpen]);

  // Cargar horarios ocupados al abrir el modal de edición o cambiar la fecha
  useEffect(() => {
    if (
      editModal.isOpen &&
      bookingToEdit &&
      editControl._formValues.entryDate
    ) {
      loadEditBookingsForDate(editControl._formValues.entryDate);
      if (!editControl._formValues.schedule) {
        setEditValue("assistants", "");
        setEditMaxAssistants(1);
      }
    }
  }, [editModal.isOpen, bookingToEdit, editControl._formValues.entryDate]);

  // Cargar horarios ocupados también al abrir el modal por primera vez (cuando hay horario ya seleccionado)
  useEffect(() => {
    if (
      editModal.isOpen &&
      bookingToEdit &&
      editControl._formValues.entryDate &&
      editControl._formValues.schedule
    ) {
      loadEditBookingsForDate(editControl._formValues.entryDate);
    }
  }, [editModal.isOpen]);

  // Actualiza el máximo de asistentes cuando cambia el horario seleccionado en el modal de edición
  useEffect(() => {
    if (
      bookingToEdit &&
      editSelectedSchedule &&
      (bookingToEdit.Space || bookingToEdit.spaceId)
    ) {
      const space = bookingToEdit.Space ?? bookingToEdit.spaceId;
      const reserved = editAssistantsPerHourRef.current[editSelectedSchedule] || 0;
      let max = space.capacity - reserved;
      setEditMaxAssistants(Math.max(max, 1));
      if (Number(editControl._formValues.assistants) > max) {
        setEditValue("assistants", String(max));
      }
    } else {
      setEditValue("assistants", "");
      setEditMaxAssistants(1);
    }
  }, [
    editSelectedSchedule,
    bookingToEdit,
    editControl._formValues.assistants,
    editControl._formValues.entryDate,
  ]);

  const totalPages = Math.ceil(total / pageSize);

  const handleCancel = (booking: IBooking) => {
    setBookingToCancel(booking);
    onOpen();
  };

  const confirmCancel = async () => {
    if (bookingToCancel) {
      try {
        await cancelBooking(bookingToCancel.id);
        setBookings((prev) => prev.filter((b) => b.id !== bookingToCancel.id));
        setBookingToCancel(null);
        onClose();
      } catch (error) {
        alert("Error al cancelar la reserva.");
      }
    }
  };

  // Handler para abrir el modal de edición
  const handleEdit = (booking: IBooking) => {
    setBookingToEdit(booking);
    const start = moment(booking.dateStart);
    setEditValue(
      "entryDate",
      new CalendarDate(start.year(), start.month() + 1, start.date())
    );
    setEditValue("schedule", "");
    setEditValue("assistants", "");
    editModal.onOpen();
  };

  // Handler para guardar la edición
  const onEditSubmit = async (data: {
    entryDate?: CalendarDate;
    schedule: string;
    assistants: string;
  }) => {
    if (!bookingToEdit || !data.entryDate) return;
    try {
      const entryDate = data.entryDate;
      const selectedSchedule = schedule.find((s) => s.key === data.schedule);
      if (!selectedSchedule) {
        alert("Horario no válido.");
        return;
      }
      const [startTime, endTime] = selectedSchedule.value.split("-");
      const dateStr = `${entryDate.year}-${String(entryDate.month).padStart(
        2,
        "0"
      )}-${String(entryDate.day).padStart(2, "0")}`;
      const dateStart = `${dateStr} ${startTime}:00`;
      const dateEnd = `${dateStr} ${endTime}:00`;
      await updateBooking(
        bookingToEdit.id,
        dateStart,
        dateEnd,
        Number(data.assistants)
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingToEdit.id
            ? { ...b, dateStart, dateEnd, assistants: Number(data.assistants) }
            : b
        )
      );
      setBookingToEdit(null);
      editModal.onClose();
    } catch (err) {
      alert("Error al editar la reserva");
    }
  };

  // Handler para renderizar las opciones de horario, deshabilitando las horas pasadas si es hoy
  const renderScheduleOptions = () => {
    const now = today("Europe/Madrid").toDate("Europe/Madrid");
    const isToday =
      entryDate &&
      entryDate.year === now.getFullYear() &&
      entryDate.month === now.getMonth() + 1 &&
      entryDate.day === now.getDate();
    const currentHour = new Date().getHours();
    return schedule.map((s) => {
      const [startHour] = s.value.split(":");
      const hour = parseInt(startHour, 10);
      const isPast = isToday && hour <= currentHour;
      return (
        <SelectItem key={s.key} isDisabled={isPast || editFullSchedules.includes(s.key)}>
          {s.value}
        </SelectItem>
      );
    });
  };

  // Copia el estilo de paginación de CommunitiesComponent
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: any) => {
    if (value === "next") {
      return (
        <button
          key={key}
          className={"bg-default-200/50 min-w-8 w-8 h-8 " + className}
          onClick={onNext}
        >
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            className="rotate-180"
          >
            <path
              d="M15.5 19l-7-7 7-7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      );
    }
    if (value === "prev") {
      return (
        <button
          key={key}
          className={"bg-default-200/50 min-w-8 w-8 h-8 " + className}
          onClick={onPrevious}
        >
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
          >
            <path
              d="M15.5 19l-7-7 7-7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      );
    }
    if (value === "dots") {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }
    return (
      <button
        key={key}
        ref={ref}
        className={
          (isActive
            ? "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold "
            : "") + className
        }
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  if (loading) return <div className="mt-4">Cargando reservas...</div>;

  return (
    <div className="mt-4">
      <h1 className="flex justify-center text-2xl font-bold mb-4">
        Reservas del usuario
      </h1>
      <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {bookings.length === 0 ? (
          <div className="col-span-full text-center text-default-500 py-12 flex flex-col items-center gap-4">
            <div>No hay reservas para este usuario.</div>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="flex flex-col items-stretch">
              <SpaceCard
                space={booking.Space ?? booking.spaceId}
                booking={{
                  dateStart: booking.dateStart,
                  dateEnd: booking.dateEnd,
                  assistants: booking.assistants,
                  username: booking.userId?.username,
                }}
                showButtons={true}
                onEdit={() => handleEdit(booking)}
                onCancel={() => handleCancel(booking)}
              />
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <Pagination
          disableCursorAnimation
          showControls
          className="gap-2"
          initialPage={1}
          radius="full"
          renderItem={renderItem}
          total={totalPages}
          variant="light"
          page={page}
          onChange={setPage}
        />
      </div>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={() => {
          setBookingToCancel(null);
          onClose();
        }}
      >
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cancelar reserva
              </ModalHeader>
              <ModalBody>
                <p>¿Seguro que quieres cancelar esta reserva?</p>
                {bookingToCancel && (
                  <>
                    <p className="text-xs text-default-600 mt-1">
                      Espacio: <b>{bookingToCancel.Space?.name || bookingToCancel.spaceId?.name}</b>
                    </p>
                    <p className="text-xs text-default-600 mt-1">
                      Fecha: {moment(bookingToCancel.dateStart).format("DD/MM/YYYY")}
                    </p>
                    <p className="text-xs text-default-600 mt-1">
                      Hora: {moment(bookingToCancel.dateStart).format("HH:mm")} - {moment(bookingToCancel.dateEnd).format("HH:mm")}
                    </p>
                    <p className="text-xs text-default-600 mt-1">
                      Asistentes: {bookingToCancel.assistants}
                    </p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={() => { setBookingToCancel(null); close(); }}>
                  No cancelar
                </Button>
                <Button className="bg-[#db4664] text-white" onPress={confirmCancel}>
                  Cancelar reserva
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        backdrop="blur"
        isOpen={editModal.isOpen}
        onClose={() => {
          setBookingToEdit(null);
          editModal.onClose();
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Editar reserva</ModalHeader>
              <ModalBody>
                <form onSubmit={handleEditSubmit(onEditSubmit)} className="gap-1 flex flex-col">
                  <Controller
                    control={editControl}
                    name="entryDate"
                    rules={{
                      required: true,
                      validate: {
                        isAfterNow: isAfterOrEqualToday,
                        isBefore: (value) =>
                          isBeforeValidation(
                            value,
                            today("Europe/Madrid").add({ months: 1 })
                          ),
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        isInvalid={!!editErrors.entryDate}
                        errorMessage={getErrorMessage(
                          editErrors.entryDate?.type,
                          {
                            field: "fecha de la reserva",
                            date: `${
                              today("Europe/Madrid").add({ months: 1 }).day
                            }/$
                              {today("Europe/Madrid").add({ months: 1 }).month
                            }/$
                              {today("Europe/Madrid").add({ months: 1 }).year
                            }`,
                          }
                        )}
                        maxValue={today("Europe/Madrid").add({ months: 1 })}
                        minValue={today("Europe/Madrid")}
                        hideTimeZone
                        isRequired={true}
                        className="w-full"
                        label="Fecha de la reserva"
                        onBlur={() => {
                          triggerEdit("entryDate");
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={editControl}
                    name="schedule"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        key={String(entryDate)}
                        placeholder="Selecciona la hora de la reserva"
                        label="Hora de la reserva"
                        isRequired={true}
                        className="w-full"
                        disabledKeys={editFullSchedules}
                      >
                        {renderScheduleOptions()}
                      </Select>
                    )}
                  />
                  <Controller
                    control={editControl}
                    name="assistants"
                    rules={{ required: true, min: 1 }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder={
                          (bookingToEdit?.Space ?? bookingToEdit?.spaceId)
                            ?.isSlotBased
                            ? "Selecciona el número de asistentes"
                            : "Selecciona el número de espacios"
                        }
                        label={
                          (bookingToEdit?.Space ?? bookingToEdit?.spaceId)
                            ?.isSlotBased
                            ? "Asistentes"
                            : "Espacios"
                        }
                        isRequired={true}
                        className="w-full mt-2"
                        selectedKeys={field.value ? [String(field.value)] : []}
                        onChange={(e) => field.onChange(e.target.value)}
                        isDisabled={
                          editMaxAssistants === 0 ||
                          !editSelectedSchedule ||
                          !editControl._formValues.schedule
                        }
                        description={
                          editSelectedSchedule
                            ? `${
                                (bookingToEdit?.Space ?? bookingToEdit?.spaceId)
                                  ?.isSlotBased
                                  ? "Plazas"
                                  : "Espacios"
                              } libres para esta hora: ${editMaxAssistants}`
                            : ""
                        }
                      >
                        {Array.from({ length: editMaxAssistants }, (_, i) =>
                          String(i + 1)
                        ).map((c) => (
                          <SelectItem key={c}>{c}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Divider className="my-4" />
                  <Button type="submit" color="primary" className="w-full mt-2">
                    Guardar cambios
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}