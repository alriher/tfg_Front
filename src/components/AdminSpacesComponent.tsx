import { useEffect, useState } from "react";
import SpaceCard from "./SpaceCard";
import { ISpace } from "../interfaces/space";
import { getSpaces } from "../services/SpacesService";
import {
  updateSpace,
  deleteSpace,
  uploadImageToCloudinary,
} from "../services/AdminSpaceServices";
import { useNavigate } from "react-router-dom";
import SpaceForm from "./SpaceForm";
import {
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import SpacesFilter from "./SpacesFilter";

const ChevronIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M15.5 19l-7-7 7-7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);
function AdminSpacesComponent() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [spaceToEdit, setSpaceToEdit] = useState<ISpace | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<ISpace | null>(null);
  const [filterName, setFilterName] = useState("");
  const [filterUsername, setFilterUsername] = useState("");
  const [filterProvincia, setFilterProvincia] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState("");

  // Calculate total pages for pagination
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Nueva función para obtener espacios con filtros
  const fetchSpaces = () => {
    setLoading(true);
    getSpaces(page, pageSize, {
      name: filterName,
      username: filterUsername,
      provincia: filterProvincia,
      localidad: filterLocalidad,
    }).then((res) => {
      setSpaces(res.spaces || res);
      setTotal(res.total || (res.spaces ? res.spaces.length : 0));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchSpaces();
    // eslint-disable-next-line
  }, [page, pageSize]);

  // Eliminar el useEffect automático de búsqueda por filtros

  // Handler para el botón de buscar
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSpaces();
  };

  // Handler para guardar la edición
  const handleEditSubmit = async (
    data: any,
    imgFile: File | null,
    imgPreview: string | null
  ) => {
    if (!spaceToEdit) return;
    let imageUrl = imgPreview;
    if (imgFile) {
      imageUrl = await uploadImageToCloudinary(imgFile);
    }
    await updateSpace(
      spaceToEdit.id,
      data.name,
      data.description,
      data.address,
      data.provincia,
      data.localidad,
      Number(data.capacity),
      Number(data.lat),
      Number(data.lon),
      imageUrl,
      data.isSlotBased === "true"
    );
    setSpaceToEdit(null);
    setLoading(true);
    getSpaces(page, pageSize).then((res) => {
      setSpaces(res.spaces || res);
      setTotal(res.total || (res.spaces ? res.spaces.length : 0));
      setLoading(false);
    });
  };

  // Handler para editar espacio
  const handleEdit = (space: ISpace) => {
    setSpaceToEdit(space);
  };

  // Handler para eliminar espacio
  const handleDelete = (space: ISpace) => {
    setSpaceToDelete(space);
  };

  // Handler para mostrar reservas del espacio
  const handleShowBookings = (space: ISpace) => {
    // Implementa la lógica para mostrar las reservas del espacio, por ejemplo:
    navigate(`/spaces/${space.id}/bookings`);
  };

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: any) => {
    if (value === "next") {
      return (
        <button
          key={key}
          className={"bg-default-200/50 min-w-8 w-8 h-8 " + className}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }
    if (value === "prev") {
      return (
        <button
          key={key}
          className={"bg-default-200/50 min-w-8 w-8 h-8 " + className}
          onClick={onPrevious}
        >
          <ChevronIcon />
        </button>
      );
    }
    if (value === "dots") {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }
    return (
      <button
        key={key}
        ref={ref}
        className={
          (isActive
            ? "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold "
            : "") + className
        }
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  // Utilidad para obtener el id de la provincia

  if (loading) return <div className="mt-4">Cargando espacios...</div>;

  return (
    <div className="mt-4">
      <h1 className="flex justify-center text-2xl font-bold mb-4">
        Espacios (admin)
      </h1>
      {/* Filtros */}
      <SpacesFilter
        filterProvincia={filterProvincia}
        setFilterProvincia={setFilterProvincia}
        filterLocalidad={filterLocalidad}
        setFilterLocalidad={setFilterLocalidad}
        filterName={filterName}
        setFilterName={setFilterName}
        filterUsername={filterUsername}
        setFilterUsername={setFilterUsername}
        onSubmit={handleFilter}
      />
      <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            showButtons={true}
            showBookingsButton={true}
            onEdit={() => handleEdit(space)}
            onCancel={() => handleDelete(space)}
            onShowBookings={() => handleShowBookings(space)}
            adminView={true}
          />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <Pagination
          disableCursorAnimation
          showControls
          className="gap-2"
          initialPage={1}
          radius="full"
          renderItem={renderItem}
          total={totalPages}
          variant="light"
          page={page}
          onChange={setPage}
        />
      </div>
      {/* Modal para eliminar espacio */}
      <Modal isOpen={!!spaceToDelete} onClose={() => setSpaceToDelete(null)}>
        <ModalContent>
          <ModalHeader>Eliminar espacio</ModalHeader>
          <ModalBody>
            ¿Seguro que quieres eliminar el espacio "{spaceToDelete?.name}"?
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => setSpaceToDelete(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-[#db4664] text-white"
              onPress={async () => {
                if (spaceToDelete) {
                  setLoading(true);
                  try {
                    await deleteSpace(Number(spaceToDelete.id));
                    setSpaceToDelete(null);
                    getSpaces(page, pageSize).then((res) => {
                      setSpaces(res.spaces || res);
                      setTotal(res.total || (res.spaces ? res.spaces.length : 0));
                      setLoading(false);
                    });
                  } catch (err) {
                    setLoading(false);
                    alert("Error al eliminar el espacio.");
                  }
                }
              }}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal para editar espacio */}
      <Modal
        isOpen={!!spaceToEdit}
        onClose={() => setSpaceToEdit(null)}
        size="4xl"
      >
        <ModalContent>
          <ModalHeader>Editar espacio</ModalHeader>
          <ModalBody className="max-h-[80vh] overflow-y-auto">
            {spaceToEdit && (
              <SpaceForm
                initialValues={spaceToEdit}
                onSubmit={handleEditSubmit}
                inModal
              />
            )}
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-between w-full">
              <Button color="default" onPress={() => setSpaceToEdit(null)}>
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                form="space-form-edit"
                isLoading={loading}
              >
                Guardar cambios
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AdminSpacesComponent;