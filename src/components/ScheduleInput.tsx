import { Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { schedule } from "../assets/schedules";
import { getErrorMessage } from "../services/ErrorServices";

export default function ScheduleInput({ control, errors }) {
  return (
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
  );
}
