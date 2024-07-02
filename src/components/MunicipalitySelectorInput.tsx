import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { IControlledInput } from "../interfaces/controlledInput";
import { IMunicipality } from "../interfaces/municipality";
import { Controller } from "react-hook-form";
import { getErrorMessage } from "../services/ErrorServices";

interface MunicipalitySelectorInputProps extends IControlledInput {
  municipalities: IMunicipality[];
  handleSelectionChange?: (id: any) => void;
  isDependent?: boolean;
  selectedProvince?: string;
}

export default function MunicipalitiesSelectorInput({
  errors,
  control,
  municipalities,
  handleSelectionChange,
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
      render={({ field }) => (
        <Autocomplete
          {...field}
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
          onSelectionChange={handleSelectionChange}
        >
          {(municipality) => (
            <AutocompleteItem key={municipality.value}>
              {municipality.nombre}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
