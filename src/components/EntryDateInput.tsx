import { today } from "@internationalized/date";
import { getErrorMessage } from "../services/ErrorServices";
import { DatePicker } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import {
  isAfterOrEqualToday,
  isBeforeValidation,
} from "../services/ValidationService";
import useDateFormatter from "../services/DateFormatterService";

interface EntryDateInputProps {
  errors: any;
  control: any;
}

export default function EntryDateInput({
  errors,
  control,
}: EntryDateInputProps) {
  const dateFormatter = useDateFormatter();
  return (
    <Controller
      control={control}
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
          isInvalid={!!errors.entryDate}
          errorMessage={getErrorMessage(errors.entryDate?.type, {
            field: "fecha de entrada",
            date: dateFormatter.format(
              today("Europe/Madrid").add({ months: 1 }).toDate("Europe/Madrid")
            ),
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
  );
}
