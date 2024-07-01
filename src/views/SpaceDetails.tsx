import { useNavigate, useParams } from "react-router-dom";
import { ISpace } from "../interfaces/space";
import { useState, useEffect } from "react";
import { getSpaceById } from "../services/CommunitiesService";
import {
  Button,
  DatePicker,
  Divider,
  Image,
  Link,
  Select,
  SelectItem,
  TimeInput,
} from "@nextui-org/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DateFormatter, today, ZonedDateTime } from "@internationalized/date";
import { useAuth } from "../providers/AuthProvider";
import { getErrorMessage } from "../services/ErrorServices";
import {
  isAfterNowValidation,
  isBeforeValidation,
} from "../services/ValidationService";
import { schedule } from "../assets/schedules";
import useDateFormatter from "../services/DateFormatterService";
interface ISpaceFormInput {
  entryDate: ZonedDateTime;
  schedule: string;
  assistants: string;
}

export default function SpaceDetails() {
  const dateFormatter = useDateFormatter();
  const { id } = useParams();
  const { user } = useAuth();
  const [space, setSpace] = useState<ISpace | null>(null);
  const [capacity, setCapacity] = useState<string[]>([]);
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

  const onSubmit: SubmitHandler<ISpaceFormInput> = (data) => {};

  if (!space) {
    return <div>Loading...</div>;
  }

  function handleLoginNavigate(): void {
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque venenatis mauris at lacus dictum, gravida vulputate
              quam ultrices. Nullam gravida condimentum magna et lobortis.
              Vivamus suscipit neque orci, sit amet molestie lacus feugiat quis.
              Integer quis nulla efficitur, pellentesque tellus vel, cursus
              risus. Vivamus egestas mi ac cursus posuere. Sed porta urna et
              commodo lacinia. Maecenas quis laoreet nulla. Fusce sit amet metus
              id ex cursus cursus. Sed sit amet cursus sem. Nam dapibus ligula
              ac laoreet posuere. Suspendisse sit amet risus ut augue efficitur
              dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Pellentesque venenatis mauris at lacus dictum, gravida
              vulputate quam ultrices. Nullam gravida condimentum magna et
              lobortis. Vivamus suscipit neque orci, sit amet molestie lacus
              feugiat quis. Integer quis nulla efficitur, pellentesque tellus
              vel, cursus risus. Vivamus egestas mi ac cursus posuere. Sed porta
              urna et commodo lacinia. Maecenas quis laoreet nulla. Fusce sit
              amet metus id ex cursus cursus. Sed sit amet cursus sem. Nam
              dapibus ligula ac laoreet posuere. Suspendisse sit amet risus ut
              augue efficitur dignissim. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Pellentesque venenatis mauris at lacus dictum,
              gravida vulputate quam ultrices. Nullam gravida condimentum magna
              et lobortis. Vivamus suscipit neque orci, sit amet molestie lacus
              feugiat quis. Integer quis nulla efficitur, pellentesque tellus
              vel, cursus risus. Vivamus egestas mi ac cursus posuere. Sed porta
              urna et commodo lacinia. Maecenas quis laoreet nulla. Fusce sit
              amet metus id ex cursus cursus. Sed sit amet cursus sem. Nam
              dapibus ligula ac laoreet posuere. Suspendisse sit amet risus ut
              augue efficitur dignissim. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Pellentesque venenatis mauris at lacus dictum,
              gravida vulputate quam ultrices. Nullam gravida condimentum magna
              et lobortis. Vivamus suscipit neque orci, sit amet molestie lacus
              feugiat quis. Integer quis nulla efficitur, pellentesque tellus
              vel, cursus risus. Vivamus egestas mi ac cursus posuere. Sed porta
              urna et commodo lacinia. Maecenas quis laoreet nulla. Fusce sit
              amet metus id ex cursus cursus. Sed sit amet cursus sem. Nam
              dapibus ligula ac laoreet posuere. Suspendisse sit amet risus ut
              augue efficitur dignissim.
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
                        date: dateFormatter.format(today("Europe/Madrid").add({ months: 1 }).toDate("Europe/Madrid")),
                      })}
                      maxValue={today("Europe/Madrid").add({ months: 1 })}
                      minValue={today("Europe/Madrid")}
                      hideTimeZone
                      isRequired={true}
                      className="w-full"
                      label="Fecha y hora de entrada"
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
                    >
                      {schedule.map((s) => (
                        <SelectItem key={s.key}>{s.value}</SelectItem>
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
