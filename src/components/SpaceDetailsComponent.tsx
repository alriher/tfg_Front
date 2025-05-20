import { useNavigate, useParams } from "react-router-dom";
import { ISpace } from "../interfaces/space";
import { IBooking } from "../interfaces/booking";
import { useState, useEffect } from "react";
import { getSpaceById } from "../services/CommunitiesService";
import { toLocalSQLString } from "../services/DateFormatterService";
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CalendarDate, today, ZonedDateTime } from "@internationalized/date";
import { useAuth } from "../providers/AuthProvider";
import { getErrorMessage } from "../services/ErrorServices";
import {
  isAfterNowValidation,
  isBeforeValidation,
} from "../services/ValidationService";
import { schedule } from "../assets/schedules";
import useDateFormatter from "../services/DateFormatterService";
import moment from "moment";
interface ISpaceFormInput {
  entryDate: CalendarDate;
  schedule: string;
  assistants: string;
  // Booleano para ver si se reserva un hueco o un espacio
}

export default function SpaceDetailsComponent() {
  const dateFormatter = useDateFormatter();
  const { id } = useParams();
  const { user } = useAuth();
  const [space, setSpace] = useState<ISpace | null>(null);
  const [capacity, setCapacity] = useState<string[]>([]);
  const [reservedSchedules, setReservedSchedules] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      entryDate: today("Europe/Madrid").add({ days: 1 }),
      schedule: "",
      assistants: "",
    },
  });

  const updateReservedSchedules = (date: CalendarDate) => {
    if (space && date) {
      const dateStr = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
      getBookingsBySpaceIdAndDate(space.id, dateStr).then((reservas: any) => {
        // Si reservas es un solo objeto, conviértelo en array
        const bookingsArray = Array.isArray(reservas) ? reservas : reservas ? [reservas] : [];
        const reservedKeys = bookingsArray
          .map((r) => {
            const start = moment(r.dateStart).format("HH:00");
            const end = moment(r.dateEnd).format("HH:00");
            const found = schedule.find((s) => s.value === `${start}-${end}`);
            return found?.key;
          })
          .filter((key): key is string => typeof key === "string");
        setReservedSchedules(reservedKeys);
      });
    }
  };

  useEffect(() => {
    if (id) {
      getSpaceById(id).then((space) => {
        setSpace(space);
        setCapacity(
          Array.from({ length: space.capacity }, (_, i) => String(i + 1))
        );
      });
    }
  }, [id]);

  useEffect(() => {
    if (space && control._formValues.entryDate) {
      const date = control._formValues.entryDate;
      const dateStr = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
      getBookingsBySpaceIdAndDate(space.id, dateStr).then(
        (reservas: IBooking[]) => {
          const reservedKeys = reservas
            .map((r) => {
              const start = moment(r.dateStart).format("HH:00");
              const end = moment(r.dateEnd).format("HH:00");
              const found = schedule.find((s) => s.value === `${start}-${end}`);
              return found?.key;
            })
            .filter((key): key is string => typeof key === "string");
          setReservedSchedules(reservedKeys);
        });
    }
  }, [space]);

  const onSubmit: SubmitHandler<ISpaceFormInput> = (data) => {
    if (!user) {
      return navigate("/login", { state: { from: `/spaces/${id}` } });
    }

    if (!data.schedule) {
      alert("Selecciona la hora de la reserva.");
      return;
    }
    try {
      // Convertir entryDate y schedule a objetos Date
      const entryDate = data.entryDate;
      console.log("ENTRY DATE" + entryDate);
      const selectedSchedule = schedule.find((s) => s.key === data.schedule);
      if (!selectedSchedule) {
        alert("Horario no válido.");
        return;
      }
      const [startTime, endTime] = selectedSchedule.value.split("-");
      const dateStr = `${entryDate.year}-${String(entryDate.month).padStart(2, "0")}-${String(entryDate.day).padStart(2, "0")}`;
      const dateStart = `${dateStr} ${startTime}:00`;
      const dateEnd = `${dateStr} ${endTime}:00`;

      console.log("DATE START" + dateStart);
      console.log("DATE END" + dateEnd);

      // Crear la reserva
      if (!space) {
        alert("Espacio no encontrado.");
        return;
      }
      createBooking(
        Number(user.id),
        Number(space.id),
        dateStart,
        dateEnd
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
    <div className="flex items-center justify-center container m-auto">
      <div className="grid grid-cols-2 gap-6 px-4 py-12">
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
        <div className="flex flex-col justify-between gap-6">
          <div>
            <h1 className="font-bold text-2xl mb-6">{space.name}</h1>
            <p className="text-pretty">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
              eveniet. Doloremque adipisci obcaecati est libero, labore nam fuga
              provident fugit, et ea suscipit iure quod distinctio dolorem quos
              voluptate mollitia. Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Ea beatae sint accusamus distinctio doloribus
              voluptatem velit assumenda esse reprehenderit ut consequatur
              debitis dolor obcaecati, at qui quas, eveniet atque quis. Lorem
              ipsum dolor, sit amet consectetur adipisicing elit. Ducimus quidem
              accusantium praesentium dolores, placeat natus quia, qui incidunt
              iusto sed, magni aliquid. Animi molestias sit tempore cumque
              architecto fuga veniam. lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Aperiam, eveniet. Doloremque adipisci obcaecati
              est libero, labore nam fuga provident fugit, et ea suscipit iure
              quod distinctio dolorem quos voluptate mollitia. Lorem ipsum dolor
              sit amet, consectetur adipisicing elit. Ea beatae sint accusamus
              distinctio doloribus voluptatem velit assumenda esse reprehenderit
              ut consequatur debitis dolor obcaecati, at qui quas, eveniet atque
              quis. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Ducimus quidem accusantium praesentium dolores, placeat natus
              quia, qui incidunt iusto sed, magni aliquid. Animi molestias sit
              tempore cumque
            </p>
          </div>
          <div>
            <h2 className="font-bold text-sm">Reservar</h2>
            <Divider className="my-4" />
            {user ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gird-cols-2 gap-2"
              >
                <Controller
                  control={control}
                  name="entryDate"
                  rules={{
                    required: true,
                    validate: {
                      isAfterNow: isAfterNowValidation,
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
                      className="w-full"
                      label="Fecha y hora de entrada"
                      onBlur={() => updateReservedSchedules(field.value)}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="schedule"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Selecciona la hora de la reserva"
                      label="Hora de la reserva"
                      isRequired={true}
                      isInvalid={!!errors.schedule}
                      errorMessage={getErrorMessage(errors.schedule?.type, {
                        field: "hora de la reserva",
                      })}
                      className="w-full"
                      disabledKeys={reservedSchedules}
                    >
                      {schedule.map((s) => (
                        <SelectItem key={s.key}>
                          {s.value}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="assistants"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Selecciona el número de asistentes"
                      label="Asistentes"
                      isRequired={true}
                      isInvalid={!!errors.assistants}
                      errorMessage={getErrorMessage(errors.assistants?.type, {
                        field: "asistentes",
                      })}
                      className="col-span-2"
                    >
                      {capacity.map((c) => (
                        <SelectItem key={c}>{c}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
                <Button type="submit" className="col-span-2" color="primary">
                  Reservar
                </Button>
              </form>
            ) : (
              <Button color="primary" as={Link} onPress={handleLoginNavigate}>
                Inicia sesión para reservar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
