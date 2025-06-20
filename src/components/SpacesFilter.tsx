import { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Button,
} from "@nextui-org/react";
import provinces from "../assets/provincias.json";
import municipalities from "../assets/municipios.json";
import SearchIcon from "./icons/SearchIcon";

interface SpacesFilterProps {
  filterProvincia: string;
  setFilterProvincia: (value: string) => void;
  filterLocalidad: string;
  setFilterLocalidad: (value: string) => void;
  filterName: string;
  setFilterName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  filterUsername?: string;
  setFilterUsername?: (value: string) => void;
}

export default function SpacesFilter({
  filterProvincia,
  setFilterProvincia,
  filterLocalidad,
  setFilterLocalidad,
  filterName,
  setFilterName,
  onSubmit,
  filterUsername,
  setFilterUsername,
}: SpacesFilterProps) {
  const [selectedProvince, setSelectedProvince] = useState("");

  const getProvinceId = (name: string) => {
    const prov = provinces.find(
      (p: any) => p.nombre.trim().toLowerCase() === name.trim().toLowerCase()
    );
    return prov ? prov.value : null;
  };

  return (
    <form
      className="py-4 px-6 lg:max-w-[1350px] lg:flex mx-auto grid md:grid-cols-2 lg:grid-cols-5 sm:grid-cols-1 items-center gap-4"
      onSubmit={onSubmit}
    >
      <Autocomplete
        label={
          <span>
            Provincia<span style={{ color: "red" }}>*</span>
          </span>
        }
        placeholder="Busca una provincia"
        selectedKey={filterProvincia}
        onSelectionChange={(value) => {
          setFilterProvincia(value as string);
          setSelectedProvince(value as string);
          setFilterLocalidad("");
        }}
        defaultItems={provinces}
        aria-label="Selector de provincia"
        allowsCustomValue={false}
        onClear={() => {
          setFilterProvincia("");
          setSelectedProvince("");
          setFilterLocalidad("");
        }}
      >
        {(province: any) => (
          <AutocompleteItem key={province.nombre} value={province.nombre}>
            {province.nombre}
          </AutocompleteItem>
        )}
      </Autocomplete>
      <Autocomplete
        label={
          <span>
            Localidad<span style={{ color: "red" }}>*</span>
          </span>
        }
        placeholder="Busca una localidad"
        selectedKey={filterLocalidad}
        onSelectionChange={(value) => {
          setFilterLocalidad(value as string);
        }}
        defaultItems={
          selectedProvince
            ? municipalities.filter(
                (m: any) => m.provinceId === getProvinceId(selectedProvince)
              )
            : []
        }
        aria-label="Selector de localidad"
        isDisabled={!selectedProvince}
        allowsCustomValue={false}
        onClear={() => setFilterLocalidad("")}
      >
        {(item: any) => (
          <AutocompleteItem key={item.nombre} value={item.nombre}>
            {item.nombre}
          </AutocompleteItem>
        )}
      </Autocomplete>
      <Input
        placeholder="Nombre del espacio"
        value={filterName}
        onValueChange={setFilterName}
      />
      {typeof filterUsername === "string" && setFilterUsername && (
        <Input
          placeholder="Usuario creador"
          value={filterUsername}
          onValueChange={setFilterUsername}
        />
      )}
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
        className="md:col-span-2 inline-flex lg:hidden"
        endContent={<SearchIcon className="size-4" />}
        color="primary"
        aria-label="Buscar"
      >
        Buscar
      </Button>
    </form>
  );
}
