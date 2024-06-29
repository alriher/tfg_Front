import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  TimeInput,
} from "@nextui-org/react";
import provincias from "../assets/provincias.json";
import municipios from "../assets/municipios.json";
import { useState, useEffect } from "react";
import { IProvincia } from "../interfaces/provincia";
import SearchIcon from "./icons/SearchIcon";

export default function SearchBar() {
  const [selectedProvincia, setSelectedProvincia] = useState<String | null>(
    null
  );
  const [filteredMunicipios, setFilteredMunicipios] = useState<IProvincia[]>(
    []
  );

  const onSelectionChange = (id: any) => {
    if (id === null) {
      setFilteredMunicipios([]);
    }
    setSelectedProvincia(id);
  };

  useEffect(() => {
    if (selectedProvincia) {
      const filtered = municipios.filter(
        (municipio) => municipio.provincia_id === selectedProvincia
      );
      setFilteredMunicipios(filtered);
    }
  }, [selectedProvincia]);

  return (
    <div className="py-4 px-6 lg:max-w-[1350px] lg:flex mx-auto grid md:grid-cols-2 lg:grid-cols-5 items-center gap-4">
      <Autocomplete
        isRequired
        defaultItems={provincias}
        label="Provincias"
        placeholder="Busca una provincias"
        className="w-full lg:max-w-xs"
        onSelectionChange={onSelectionChange}
      >
        {(provincias) => (
          <AutocompleteItem key={provincias.value}>
            {provincias.nombre}
          </AutocompleteItem>
        )}
      </Autocomplete>
      <Autocomplete
        isDisabled={!selectedProvincia}
        isRequired
        defaultItems={filteredMunicipios}
        label="Localidades"
        placeholder="Busca una localidad"
        className="w-full lg:max-w-xs"
      >
        {(filteredMunicipios) => (
          <AutocompleteItem key={filteredMunicipios.value}>
            {filteredMunicipios.nombre}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <DatePicker
        granularity="minute"
        className="w-full lg:max-w-xs"
        label="Fecha y hora de entrada"
      />
      <TimeInput label="Hora de salida" className="w-full lg:max-w-xs" />

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
    </div>
  );
}
