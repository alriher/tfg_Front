import { Button } from "@nextui-org/react";
import provinces from "../assets/provincias.json";
import municipalities from "../assets/municipios.json";
import { useState, useEffect } from "react";
import SearchIcon from "./icons/SearchIcon";
import { SubmitHandler } from "react-hook-form";
import EntryDateInput from "./EntryDateInput";
import ScheduleInput from "./ScheduleInput";
import ProvinceSelectorInput from "./ProvinceSelectorInput";
import MunicipalitiesSelectorInput from "./MunicipalitySelectorInput";
import { IMunicipality } from "../interfaces/municipality";
import {
  ISearchContextForm,
  useSearchFormContext,
} from "../providers/SearchProvider";

export default function SearchBar() {
  const [filteredMunicipios, setFilteredMunicipios] = useState<IMunicipality[]>(
    []
  );

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useSearchFormContext();

  const selectedProvincia = watch("province");
  const handleSelectionChangeProvinces = (id: string | null) => {
    if (id === null) {
      setFilteredMunicipios([]);
    }
  };

  const onSubmit: SubmitHandler<ISearchContextForm> = (data) => {};

  useEffect(() => {
    if (selectedProvincia) {
      const filtered = municipalities.filter(
        (municipality) => municipality.provinceId === selectedProvincia
      );
      setFilteredMunicipios(filtered);
    }
  }, [selectedProvincia]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-4 px-6 lg:max-w-[1350px] lg:flex mx-auto grid md:grid-cols-2 lg:grid-cols-5 items-center gap-4"
    >
      <ProvinceSelectorInput
        errors={errors}
        control={control}
        provinces={provinces}
        handleSelectionChange={handleSelectionChangeProvinces}
      />
      <MunicipalitiesSelectorInput
        control={control}
        errors={errors}
        municipalities={filteredMunicipios}
        isDependent={true}
        selectedProvince={selectedProvincia}
        register={register}
      />
      <EntryDateInput control={control} errors={errors} />
      <ScheduleInput control={control} errors={errors} />

      <Button
        className="hidden lg:inline-flex w-auto"
        radius="full"
        isIconOnly
        color="primary"
        aria-label="Buscar"
      >
        <SearchIcon className="size-4" />
      </Button>
      <Button
        className="col-span-2 inline-flex lg:hidden"
        endContent={<SearchIcon className="size-4" />}
        color="primary"
        aria-label="Buscar"
      >
        Buscar
      </Button>
    </form>
  );
}
