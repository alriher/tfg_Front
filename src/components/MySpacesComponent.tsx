import { useEffect, useState } from "react";
import { getSpacesByUserId, deleteSpace } from "../services/SpaceAdminServices";
import { useAuth } from "../providers/AuthProvider";
import SpaceCard from "../components/SpaceCard";
import { ISpace } from "../interfaces/space";
import { Pagination, PaginationItemType, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { getBookingsBySpaceIdPaginated } from "../services/SpaceAdminServices";
import SpaceForm from "../components/SpaceForm";
import { updateSpace, uploadImageToCloudinary} from "../services/SpaceAdminServices";

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

export default function MySpacesComponent() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [spaceToEdit, setSpaceToEdit] = useState<ISpace | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<ISpace | null>(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [bookingsPageSize] = useState(15);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getSpacesByUserId(Number(user.id), page, pageSize).then((res) => {
        setSpaces(res.spaces || res);
        setTotal(res.total || (res.spaces ? res.spaces.length : 0));
        setLoading(false);
      });
    }
  }, [user, page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

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
    if (value === PaginationItemType.NEXT) {
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
    if (value === PaginationItemType.PREV) {
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
    if (value === PaginationItemType.DOTS) {
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

  const handleEdit = (space: ISpace) => setSpaceToEdit(space);
  const handleDelete = (space: ISpace) => setSpaceToDelete(space);
  const handleShowBookings = (space: ISpace) => {
    setShowBookingsModal(true);
    fetchBookings(space.id, 1);
  };
  const fetchBookings = (spaceId: number, page: number) => {
    getBookingsBySpaceIdPaginated(spaceId, page, bookingsPageSize).then(res => {
      setBookings(res.bookings || res);
      setBookingsTotal(res.total || (res.bookings ? res.bookings.length : 0));
      setBookingsPage(page);
    });
  };

  // Handler para guardar la edición
  const handleEditSubmit = async (data: any, imgFile: File | null, imgPreview: string | null) => {
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
    // Recargar espacios
    if (user?.id) {
      setLoading(true);
      getSpacesByUserId(Number(user.id), page, pageSize).then((res) => {
        setSpaces(res.spaces || res);
        setTotal(res.total || (res.spaces ? res.spaces.length : 0));
        setLoading(false);
      });
    }
  };

  if (loading) {
    return <div className="mt-4">Cargando tus espacios...</div>;
  }

  return (
    <div className="mt-4">
      <h1 className="flex justify-center text-2xl font-bold mb-4">Mis espacios</h1>
      {spaces.length === 0 ? (
        <p>No tienes espacios creados.</p>
      ) : (
        <>
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
        </>
      )}
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
            <Button className="bg-[#db4664] text-white" onPress={async () => {
              if (spaceToDelete && user?.id) {
                setLoading(true);
                try {
                  await deleteSpace(Number(spaceToDelete.id), Number(user.id));
                  setSpaceToDelete(null);
                  // Recargar espacios
                  getSpacesByUserId(Number(user.id), page, pageSize).then((res) => {
                    setSpaces(res.spaces || res);
                    setTotal(res.total || (res.spaces ? res.spaces.length : 0));
                    setLoading(false);
                  });
                } catch (err) {
                  setLoading(false);
                  alert('Error al eliminar el espacio.');
                }
              }
            }}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal para ver reservas del espacio */}
      <Modal isOpen={showBookingsModal} onClose={() => setShowBookingsModal(false)} size="4xl">
        <ModalContent>
          <ModalHeader>Reservas del espacio</ModalHeader>
          <ModalBody>
            {bookings.length === 0 ? (
              <div>No hay reservas para este espacio.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded p-2">
                    <div><b>Usuario:</b> {booking.userId}</div>
                    <div><b>Fecha inicio:</b> {booking.dateStart}</div>
                    <div><b>Fecha fin:</b> {booking.dateEnd}</div>
                    <div><b>Asistentes:</b> {booking.assistants}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center items-center gap-4 mt-4">
              <Pagination
                disableCursorAnimation
                showControls
                className="gap-2"
                initialPage={1}
                radius="full"
                total={Math.ceil(bookingsTotal / bookingsPageSize)}
                page={bookingsPage}
                onChange={(page) => fetchBookings(bookings[0]?.spaceId, page)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => setShowBookingsModal(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal para editar espacio */}
      <Modal isOpen={!!spaceToEdit} onClose={() => setSpaceToEdit(null)} size="4xl">
        <ModalContent>
          <ModalHeader>Editar espacio</ModalHeader>
          <ModalBody className="max-h-[80vh] overflow-y-auto">
            {spaceToEdit && (
              <SpaceForm
                initialValues={spaceToEdit}
                onSubmit={handleEditSubmit}
                submitLabel="Guardar cambios"
                inModal
              />
            )}
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-between w-full">
              <Button color="default" onPress={() => setSpaceToEdit(null)}>
                Cancelar
              </Button>
              <Button color="primary" type="submit" form="space-form-edit" isLoading={loading}>
                Guardar cambios
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}