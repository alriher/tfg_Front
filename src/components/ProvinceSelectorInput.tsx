import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Controller, UseFormRegister } from "react-hook-form";
import { IControlledInput } from "../interfaces/controlledInput";
import { getErrorMessage } from "../services/ErrorServices";
import { IProvince } from "../interfaces/province";
import {
  ISearchContextForm,
  useSearchFormContext,
} from "../providers/SearchProvider";

interface ProvinceSelectorProps extends IControlledInput {
  provinces: IProvince[];
  handleSelectionChange?: (id: any) => void;
}

export default function ProvinceSelectorInput({
  provinces,
  handleSelectionChange,
}: ProvinceSelectorProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useSearchFormContext();
  return (
    <Controller
      control={control}
      name="province"
      rules={{
        required: true,
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Autocomplete
          onBlur={onBlur}
          onSelectionChange={(value) => {
            onChange(value);
            if (handleSelectionChange) {
              handleSelectionChange(value);
            }
          }}
          onClear={() => setValue("province", null)}
          selectedKey={value}
          defaultItems={provinces}
          isInvalid={!!errors.province}
          errorMessage={getErrorMessage(errors.province?.type, {
            field: "provincia",
          })}
          label="Provincias"
          placeholder="Busca una provincia"
          className="w-full lg:max-w-xs"
        >
          {(province: IProvince) => (
            <AutocompleteItem key={province.value} value={province.value}>
              {province.nombre}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
