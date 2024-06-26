import { Autocomplete, AutocompleteItem, DateRangePicker } from "@nextui-org/react";
import provincias from "../assets/provincias.json";
import municipios from "../assets/municipios.json";
import { useState, useEffect } from "react";
import { Provincia } from "../interfaces/provincia";
import {today, getLocalTimeZone} from "@internationalized/date";

export default function SearchBar() {
  const [selectedProvincia, setSelectedProvincia] = useState<String | null>(
    null
  );
  const [filteredMunicipios, setFilteredMunicipios] = useState<Provincia[]>(
    []
  );

  const onSelectionChange = (id: any) => {
    if(id === null){
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
      console.log(filtered);
    }
  }, [selectedProvincia]);

  return (
    <div className="py-4 flex justify-center gap-2">
      <Autocomplete
        isRequired
        defaultItems={provincias}
        label="Provincias"
        placeholder="Busca una provincias"
        className="max-w-xs"
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
        className="max-w-xs"
      >
        {(filteredMunicipios) => (
          <AutocompleteItem key={filteredMunicipios.value}>
            {filteredMunicipios.nombre}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <DateRangePicker 
      label="Stay duration" 
      isRequired
      minValue={today(getLocalTimeZone())}
      className="max-w-xs"
    />
    </div>
  );
}
