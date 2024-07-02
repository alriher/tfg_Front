import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { IControlledInput } from "../interfaces/controlledInput";
import { getErrorMessage } from "../services/ErrorServices";
import { IProvince } from "../interfaces/province";

interface ProvinceSelectorProps extends IControlledInput {
  provinces: IProvince[];
  handleSelectionChange?: (id: any) => void;
}

export default function ProvinceSelectorInput({
  control,
  errors,
  provinces,
  handleSelectionChange,
}: ProvinceSelectorProps) {
  return (
    <Controller
      control={control}
      name="provinces"
      rules={{
        required: true,
      }}
      render={({ field }) => (
        <Autocomplete
          {...field}
          isRequired
          defaultItems={provinces}
          isInvalid={!!errors.provinces}
          errorMessage={getErrorMessage(errors.provinces?.type, {
            field: "provincia",
          })}
          label="Provincias"
          placeholder="Busca una provincias"
          className="w-full lg:max-w-xs"
          onSelectionChange={handleSelectionChange}
        >
          {(province) => (
            <AutocompleteItem key={province.value}>
              {province.nombre}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
