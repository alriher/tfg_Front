import { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import provinces from "../assets/provincias.json";
import municipalities from "../assets/municipios.json";
import SpaceMap from "../components/SpaceMap";
import { getErrorMessage } from "../services/ErrorServices";
import { uploadImageToCloudinary } from "../services/AdminSpaceServices";
import { ISpace } from "../interfaces/space";

interface SpaceFormProps {
  initialValues?: Partial<ISpace>;
  onSubmit: (data: any, imageFile: File | null, imagePreview: string | null) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  inModal?: boolean;
  onCancel?: () => void; // Nuevo: handler para cancelar
}

export default function SpaceForm({ initialValues = {}, onSubmit, loading, submitLabel = "Guardar", inModal = false, onCancel }: SpaceFormProps) {
  const [imgPreview, setImgPreview] = useState<string | null>(initialValues.img || null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [lat, setLat] = useState<string>(initialValues.lat ? String(initialValues.lat) : "");
  const [lon, setLon] = useState<string>(initialValues.lon ? String(initialValues.lon) : "");
  const [province, setProvince] = useState(initialValues.provincia || "");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      address: initialValues.address || "",
      provincia: initialValues.provincia || "",
      localidad: initialValues.localidad || "",
      capacity: initialValues.capacity ? String(initialValues.capacity) : "",
      lat: initialValues.lat ? String(initialValues.lat) : "",
      lon: initialValues.lon ? String(initialValues.lon) : "",
      isSlotBased: initialValues.isSlotBased !== undefined ? String(initialValues.isSlotBased) : "false",
    },
  });

  useEffect(() => {
    if (initialValues.provincia) setProvince(initialValues.provincia);
    if (initialValues.lat) setLat(String(initialValues.lat));
    if (initialValues.lon) setLon(String(initialValues.lon));
  }, [initialValues]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getProvinceId = (name: string) => {
    const prov = provinces.find(
      (p: any) => p.nombre.trim().toLowerCase() === name.trim().toLowerCase()
    );
    return prov ? prov.value : null;
  };

  const internalOnSubmit = async (data: any) => {
    setError(null);
    await onSubmit(data, imgFile, imgPreview);
  };

  return (
    <form id="space-form-edit" className="flex flex-col gap-4" onSubmit={handleSubmit(internalOnSubmit)}>
      {error && (
        <div className="text-danger-500 text-sm font-semibold">{error}</div>
      )}
      <div className="flex flex-col gap-4">
        <div className="relative w-full max-h-[500px] h-fit flex flex-col items-center justify-center">
          <label htmlFor="img-upload" className="w-full cursor-pointer">
            <input
              id="img-upload"
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <div className="bg-center bg-no-repeat bg-cover max-h-[500px] h-fit w-full aspect-video rounded-large border border-default-200 flex items-center justify-center overflow-hidden">
              {imgPreview ? (
                <img
                  src={imgPreview}
                  alt="Previsualización"
                  className="object-cover w-full max-h-[500px]"
                />
              ) : (
                <span className="text-default-400">
                  Haz click para subir una imagen
                </span>
              )}
            </div>
          </label>
        </div>
        <div className="mt-4">
          {/* Si está en modal, solo mostrar el mapa compacto */}
          {!inModal && (
            <div className="hidden md:block rounded-large overflow-hidden">
              <SpaceMap
                lat={lat ? parseFloat(lat) : 39.4699}
                lng={lon ? parseFloat(lon) : -0.3763}
                onLocationChange={(newLat, newLng) => {
                  setLat(newLat.toString());
                  setLon(newLng.toString());
                  setValue("lat", newLat.toString());
                  setValue("lon", newLng.toString());
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            label="Nombre"
            {...field}
            isRequired
            isInvalid={!!errors.name}
            errorMessage={getErrorMessage(errors.name?.type, { field: "nombre" })}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{ required: true }}
        render={({ field }) => (
          <Textarea
            label="Descripción"
            minRows={3}
            {...field}
            isRequired
            isInvalid={!!errors.description}
            errorMessage={getErrorMessage(errors.description?.type, { field: "descripción" })}
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            label="Dirección"
            {...field}
            isRequired
            isInvalid={!!errors.address}
            errorMessage={getErrorMessage(errors.address?.type, { field: "dirección" })}
          />
        )}
      />
      <Controller
        control={control}
        name="provincia"
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label={<span>Provincia<span style={{color: 'red'}}>*</span></span>}
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              field.onChange(value);
              setProvince(value);
              setValue("localidad", "");
            }}
            isInvalid={!!errors.provincia}
            errorMessage={getErrorMessage(errors.provincia?.type, { field: "provincia" })}
          >
            {provinces.map((prov: any) => (
              <SelectItem key={prov.nombre}>{prov.nombre}</SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        control={control}
        name="localidad"
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label={<span>Localidad<span style={{color: 'red'}}>*</span></span>}
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              field.onChange(value);
            }}
            isInvalid={!!errors.localidad}
            errorMessage={getErrorMessage(errors.localidad?.type, { field: "localidad" })}
            isDisabled={!province}
            items={
              province
                ? municipalities.filter(
                    (m: any) => m.provinceId === getProvinceId(province)
                  )
                : []
            }
          >
            {(item: any) => (
              <SelectItem key={item.nombre}>{item.nombre}</SelectItem>
            )}
          </Select>
        )}
      />
      <Controller
        control={control}
        name="capacity"
        rules={{ required: true, min: 1 }}
        render={({ field }) => (
          <Input
            label="Capacidad"
            type="number"
            min={1}
            {...field}
            isRequired
            isInvalid={!!errors.capacity}
            errorMessage={getErrorMessage(errors.capacity?.type, { field: "capacidad" })}
          />
        )}
      />
      <Controller
        control={control}
        name="isSlotBased"
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label={<span>Tipo de reserva <span style={{color: 'red'}}>*</span></span>}
            selectedKeys={field.value !== undefined ? [String(field.value)] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];
              field.onChange(value); // Guardar como string
            }}
            isInvalid={!!errors.isSlotBased}
            errorMessage={getErrorMessage(errors.isSlotBased?.type, { field: "tipo de reserva" })}
          >
            <SelectItem key="true">Basado en plazas (asientos, huecos, etc.)</SelectItem>
            <SelectItem key="false">Basado en espacios (pistas, salas, etc.)</SelectItem>
          </Select>
        )}
      />
      {/* Si está en modal, mostrar siempre el mapa compacto */}
      {(inModal || !inModal) && (
        <div className={inModal ? "rounded-large overflow-hidden" : "md:hidden rounded-large overflow-hidden"}>
          <SpaceMap
            lat={lat ? parseFloat(lat) : 39.4699}
            lng={lon ? parseFloat(lon) : -0.3763}
            onLocationChange={(newLat, newLng) => {
              setLat(newLat.toString());
              setLon(newLng.toString());
              setValue("lat", newLat.toString());
              setValue("lon", newLng.toString());
            }}
          />
        </div>
      )}
      <Controller
        control={control}
        name="lat"
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            label="Latitud"
            {...field}
            type="number"
            step="any"
            isRequired
            readOnly
            isInvalid={!!errors.lat}
            errorMessage={getErrorMessage(errors.lat?.type, { field: "latitud" })}
          />
        )}
      />
      <Controller
        control={control}
        name="lon"
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            label="Longitud"
            {...field}
            type="number"
            step="any"
            isRequired
            readOnly
            isInvalid={!!errors.lon}
            errorMessage={getErrorMessage(errors.lon?.type, { field: "longitud" })}
          />
        )}
      />
      
      {/* Elimina los botones de aquí, ya están en el ModalFooter */}
    </form>
  );
}
