import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Select,
  SelectItem,
  TimeInput,
} from "@nextui-org/react";
import provinces from "../assets/provincias.json";
import municipalities from "../assets/municipios.json";
import { useState, useEffect, Key } from "react";
import { IProvince } from "../interfaces/province";
import SearchIcon from "./icons/SearchIcon";
import { getErrorMessage } from "../services/ErrorServices";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CalendarDate, today } from "@internationalized/date";
import EntryDateInput from "./EntryDateInput";
import ScheduleInput from "./ScheduleInput";
import ProvinceSelectorInput from "./ProvinceSelectorInput";
import MunicipalitiesSelectorInput from "./MunicipalitySelectorInput";
import { IMunicipality } from "../interfaces/municipality";

interface ISearchBarFormInput {
  province: string | null;
  municipality: string | null;
  entryDate: CalendarDate | null;
  schedule: string | null;
}

export default function SearchBar() {
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(
    null
  );
  const [filteredMunicipios, setFilteredMunicipios] = useState<IMunicipality[]>(
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      province: null,
      municipality: null,
      entryDate: today("Europe/Madrid"),
      schedule: null,
    },
  });

  const handleSelectionChangeProvinces = (id: string | null) => {
    if (id === null) {
      setFilteredMunicipios([]);
    }
    setSelectedProvincia(id);
  };

  const onSubmit: SubmitHandler<ISearchBarFormInput> = (data) => {};

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
        selectedProvince={selectedProvincia as string}
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
