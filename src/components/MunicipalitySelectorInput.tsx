import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { IControlledInput } from "../interfaces/controlledInput";
import { IMunicipality } from "../interfaces/municipality";
import { Controller, UseFormRegister } from "react-hook-form";
import { getErrorMessage } from "../services/ErrorServices";
import { ISearchContextForm } from "../providers/SearchProvider";

interface MunicipalitySelectorInputProps extends IControlledInput {
  municipalities: IMunicipality[];
  handleSelectionChange?: (id: any) => void;
  register?: UseFormRegister<ISearchContextForm>;
  isDependent?: boolean;
  selectedProvince?: string | null;
}

export default function MunicipalitiesSelectorInput({
  errors,
  control,
  municipalities,
  handleSelectionChange,
  register,
  isDependent,
  selectedProvince,
}: MunicipalitySelectorInputProps) {
  return (
    <Controller
      control={control}
      name="municipality"
      rules={{
        required: true,
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Autocomplete
          onBlur={onBlur}
          onSelectionChange={(value) => {
            onChange({ target: { value } });
            if (handleSelectionChange) {
              handleSelectionChange(value);
            }
          }}
          selectedKey={value}
          isRequired
          isDisabled={isDependent && !selectedProvince}
          defaultItems={municipalities}
          isInvalid={!!errors.municipality}
          errorMessage={getErrorMessage(errors.municipality?.type, {
            field: "municipio",
          })}
          label="Municipios"
          placeholder="Selecciona un municipio"
          className="w-full lg:max-w-xs"
        >
          {(municipality) => (
            <AutocompleteItem
              key={municipality.value}
              value={municipality.value}
            >
              {municipality.nombre}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
