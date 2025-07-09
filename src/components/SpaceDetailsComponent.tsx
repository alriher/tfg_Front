import { useNavigate, useParams } from "react-router-dom";
import { ISpace } from "../interfaces/space";
import { IBooking } from "../interfaces/booking";
import { useState, useEffect, useRef } from "react";
import { getSpaceById } from "../services/SpacesService.tsx";
import {
  createBooking,
  getBookingsBySpaceIdAndDate,
} from "../services/BookingService.tsx";
import {
  Button,
  DatePicker,
  Divider,
  Image,
  Link,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { CalendarDate, today } from "@internationalized/date";
import { useAuth } from "../providers/AuthProvider";
import { getErrorMessage } from "../services/ErrorServices";
import {
  isAfterOrEqualToday,
  isBeforeValidation,
} from "../services/ValidationService";
import { schedule } from "../assets/schedules";
import useDateFormatter from "../services/DateFormatterService";
import moment from "moment";
import SpaceMap from "./SpaceMap";
interface ISpaceFormInput {
  entryDate: CalendarDate;
  schedule: string;
  assistants: string;
}

export default function SpaceDetailsComponent() {
  const dateFormatter = useDateFormatter();
  const { id } = useParams();
  const { user } = useAuth();
  const [space, setSpace] = useState<ISpace | null>(null);
  const [fullSchedules, setFullSchedules] = useState<string[]>([]);
  const [maxAssistants, setMaxAssistants] = useState(1);
  const assistantsPerHourRef = useRef<{ [key: string]: number }>({});
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      entryDate: today("Europe/Madrid").add({ days: 1 }),
      schedule: "",
      assistants: "",
    },
  });

  const entryDate = useWatch({ control, name: "entryDate" });
  useEffect(() => {
    setValue("schedule", "");
    trigger("schedule"); // fuerza la validación y el render del select
    setValue("assistants", "");
  }, [entryDate, setValue, trigger]);

  const selectedSchedule = useWatch({ control, name: "schedule" });
  useEffect(() => {
    setValue("assistants", "");
  }, [selectedSchedule, setValue]);

  useEffect(() => {
    if (id) {
      getSpaceById(id).then((space) => {
        console.log("SPACE", space);
        setSpace(space);
      });
    }
  }, [id]);

  useEffect(() => {
    if (space && control._formValues.entryDate) {
      loadBookingsForDate(control._formValues.entryDate);
    }
    // Solo cuando el espacio esté cargado o cambie la fecha por defecto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [space]);

  useEffect(() => {
    if (space && selectedSchedule) {
      const reserved = assistantsPerHourRef.current[selectedSchedule] || 0;
      const max = Math.max(space.capacity - reserved, 0);
      setMaxAssistants(max);
      if (Number(control._formValues.assistants) > max) {
        setValue("assistants", "");
      }
    } else {
      setMaxAssistants(1);
    }
  }, [selectedSchedule, space, setValue, control._formValues.assistants]);

  const loadBookingsForDate = async (date: CalendarDate) => {
    if (space && date) {
      const dateStr = `${date.year}-${String(date.month).padStart(
        2,
        "0"
      )}-${String(date.day).padStart(2, "0")}`;
      const reservas = await getBookingsBySpaceIdAndDate(space.id, dateStr);
      const assistantsPerHour: { [key: string]: number } = {};
      reservas.forEach((r: IBooking) => {
        const start = moment(r.dateStart).format("HH:mm");
        const end = moment(r.dateEnd).format("HH:mm");
        const scheduleValue = `${start}-${end}`;
        const scheduleKey = schedule.find(
          (s) => s.value === scheduleValue
        )?.key;
        if (scheduleKey) {
          assistantsPerHour[scheduleKey] =
            (assistantsPerHour[scheduleKey] || 0) + (r.assistants || 1);
        }
      });
      assistantsPerHourRef.current = assistantsPerHour;
      const full = Object.entries(assistantsPerHour)
        .filter(([_, count]) => count >= space.capacity)
        .map(([key]) => key);
      setFullSchedules(full);
    }
  };

  const onSubmit: SubmitHandler<ISpaceFormInput> = (data) => {
    if (!user) {
      return navigate("/login", { state: { from: `/spaces/${id}` } });
    }

    if (!data.schedule) {
      alert("Selecciona la hora de la reserva.");
      return;
    }
    try {
      const entryDate = data.entryDate;
      console.log("ENTRY DATE" + entryDate);
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

      console.log("DATE START" + dateStart);
      console.log("DATE END" + dateEnd);

      if (!space) {
        alert("Espacio no encontrado.");
        return;
      }

      console.log("NUMERO DE ASISTENTES" + Number(data.assistants));
      createBooking(
        Number(user.id),
        Number(space.id),
        dateStart,
        dateEnd,
        Number(data.assistants)
      );

      alert("Reserva creada con éxito");
      navigate("/bookings");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error al crear la reserva.");
    }
  };

  if (!space) {
    return <div>Loading...</div>;
  }

  function handleLoginNavigate() {
    navigate("/login", { state: { from: `/spaces/${id}` } });
  }

  return (
    <div className="flex container m-auto">
      <div className="grid px-6 grid-cols-1 md:grid-cols-2 w-full gap-6 py-12">
        {/* Imagen y mapa a la izquierda */}
        <div>
          <Image
            isZoomed
            shadow="md"
            classNames={{
              wrapper: "bg-center bg-no-repeat bg-cover max-h-[500px] h-fit",
            }}
            width="100%"
            className="max-h-[500px]"
            fallbackSrc="https://via.placeholder.com/300x200"
            src={space.img}
          ></Image>
          <div className="md:block hidden mt-4">
            {space.lat && space.lon && (
              <div className="rounded-large overflow-hidden">
                <SpaceMap lat={space.lat} lng={space.lon} />
              </div>
            )}
            <div>
              <p className="text-pretty text-md text-gray-500">
                {space.address}, {space.localidad}, {space.provincia}
              </p>
            </div>
          </div>
        </div>
        {/* Formulario y detalles a la derecha */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-bold text-2xl mb-6">{space.name}</h1>
            <p className="text-pretty">{space.description}</p>
          </div>
          <div>
            <h2 className="font-bold text-sm">Reservar</h2>
            <Divider className="my-4" />
            {user ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <Controller
                  control={control}
                  name="entryDate"
                  rules={{
                    required: true,
                    validate: {
                      isAfterNow: isAfterOrEqualToday,
                      isBeforeBookings: (value) =>
                        isBeforeValidation(
                          value,
                          today("Europe/Madrid").add({ months: 1 })
                        ),
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      isInvalid={!!errors.entryDate}
                      errorMessage={getErrorMessage(errors.entryDate?.type, {
                        field: "fecha de entrada",
                        date: dateFormatter.format(
                          today("Europe/Madrid")
                            .add({ months: 1 })
                            .toDate("Europe/Madrid")
                        ),
                      })}
                      maxValue={today("Europe/Madrid").add({ months: 1 })}
                      minValue={today("Europe/Madrid")}
                      hideTimeZone
                      isRequired={true}
                      label="Fecha de entrada"
                      onBlur={() => {
                        trigger("entryDate"); // <-- fuerza validación al salir del campo
                        loadBookingsForDate(field.value);
                        setValue("assistants", "");
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="schedule"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    const entryDate = control._formValues.entryDate;
                    const now = today("Europe/Madrid").toDate("Europe/Madrid");
                    const isToday =
                      entryDate &&
                      entryDate.year === now.getFullYear() &&
                      entryDate.month === now.getMonth() + 1 &&
                      entryDate.day === now.getDate();

                    const currentHour = new Date().getHours();
                    const disableSchedule = !!errors.entryDate;

                    return (
                      <Select
                        key={
                          entryDate
                            ? `${entryDate.year}-${entryDate.month}-${entryDate.day}`
                            : "select"
                        }
                        {...field}
                        placeholder="Selecciona la hora de la reserva"
                        label="Hora de la reserva"
                        isRequired={true}
                        disabledKeys={fullSchedules}
                        isDisabled={disableSchedule}
                        onBlur={() => setValue("assistants", "")}
                      >
                        {schedule.map((s) => {
                          const [startHour] = s.value.split(":");
                          const hour = parseInt(startHour, 10);
                          const isPast = isToday && hour <= currentHour;
                          return (
                            <SelectItem key={s.key} isDisabled={isPast}>
                              {s.value}
                            </SelectItem>
                          );
                        })}
                      </Select>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="assistants"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        placeholder={
                          space?.isSlotBased
                            ? "Selecciona el número de asistentes"
                            : "Selecciona el número de espacios"
                        }
                        label={space?.isSlotBased ? "Asistentes" : "Espacios"}
                        isRequired={true}
                        isInvalid={!!errors.assistants}
                        errorMessage={getErrorMessage(errors.assistants?.type, {
                          field: space?.isSlotBased ? "asistentes" : "espacios",
                        })}
                        className="mt-2 md:col-span-2"
                        isDisabled={maxAssistants === 0 || !selectedSchedule}
                        description={
                          selectedSchedule
                            ? `${
                                space?.isSlotBased ? "Plazas" : "Espacios"
                              } libres para esta hora: ${maxAssistants}`
                            : ""
                        }
                      >
                        {Array.from({ length: maxAssistants }, (_, i) =>
                          String(i + 1)
                        ).map((c) => (
                          <SelectItem key={c}>{c}</SelectItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
                <Button type="submit" className="md:col-span-2" color="primary">
                  Reservar
                </Button>
                <div className="md:hidden mt-4">
                  {space.lat && space.lon && (
                    <div className="rounded-large overflow-hidden">
                      <SpaceMap lat={space.lat} lng={space.lon} />
                    </div>
                  )}
                  <div>
                    <p className="text-pretty text-md text-gray-500">
                      {space.address}, {space.localidad}, {space.provincia}
                    </p>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <Button color="primary" as={Link} onPress={handleLoginNavigate}>
                  Inicia sesión para reservar
                </Button>
                <div className="md:hidden mt-4">
                  {space.lat && space.lon && (
                    <div className="rounded-large overflow-hidden">
                      <SpaceMap lat={space.lat} lng={space.lon} />
                    </div>
                  )}
                  <div>
                    <p className="text-pretty text-md text-gray-500">
                      {space.address}, {space.localidad}, {space.provincia}
                    </p>
                  </div>
                </div>
              </>
            )
            
            }
          </div>
        </div>
      </div>
    </div>
  );
}
