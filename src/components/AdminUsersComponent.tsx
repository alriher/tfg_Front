import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import SearchIcon from "./icons/SearchIcon";
import { IUser } from "../interfaces/user";
import { getAllUsers, updateUserSpaceAdmin, deleteUser } from "../services/AdminServices";

const columns = [
  { name: "Usuario", uid: "username" },
  { name: "Email", uid: "email" },
  { name: "Nombre completo", uid: "fullName" },
  { name: "Rol", uid: "isSpaceAdmin" },
  { name: "Acción", uid: "action" },
];

export default function AdminUsersComponent() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [total, setTotal] = useState(0);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Nuevo: resetear página a 1 cuando cambia el filtro
  useEffect(() => {
    setPage(1);
  }, [filterValue]);

  useEffect(() => {
    // Pasar el filtro al backend si existe
    getAllUsers(page, pageSize, filterValue).then((res) => {
      if (Array.isArray(res.users)) {
        setUsers(res.users);
        setTotal(res.total || res.users.length);
      } else if (Array.isArray(res)) {
        setUsers(res);
        setTotal(res.length);
      }
    });
  }, [page, filterValue]);

  // Eliminar filtrado y paginación local, siempre usar backend
  const paginatedUsers = users;
  const totalPages = Math.ceil(total / pageSize) || 1;

  async function handleToggleAdmin(userId: string, current: boolean) {
    try {
      await updateUserSpaceAdmin(userId, !current);
      setUsers(users => users.map(u => u.id === userId ? { ...u, isSpaceAdmin: !current } : u));
    } catch (err) {
      alert("Error al actualizar el rol de administrador");
    }
  }

  async function handleDeleteUser(userId: string) {
    const user = users.find(u => u.id === userId);
    setUserToDelete(user || null);
    onOpen();
  }

  async function confirmDeleteUser() {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
      onClose();
      // Refrescar la tabla tras eliminar
      getAllUsers(page, pageSize, filterValue).then((res) => {
        if (Array.isArray(res.users)) {
          setUsers(res.users);
          setTotal(res.total || res.users.length);
        } else if (Array.isArray(res)) {
          setUsers(res);
          setTotal(res.length);
        }
      });
    } catch (err) {
      alert("Error al eliminar el usuario");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="container mx-auto bg-white rounded-xl shadow p-4">
        <div className="flex justify-start gap-3 items-end mb-2">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar usuario..."
            startContent={<SearchIcon className="w-5 h-5 text-default-400" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
        </div>
        <Table
          aria-label="Tabla de usuarios admin"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No se encontraron usuarios"} items={paginatedUsers}>
            {(user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name} {user.lastName}</TableCell>
                <TableCell>
                  {user.isSpaceAdmin ? (
                    <span className="text-danger font-semibold">Admin</span>
                  ) : (
                    <span className="text-default-500">Usuario</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      className={`px-2 py-1 rounded text-xs font-semibold border ${user.isSpaceAdmin ? 'border-danger text-danger' : 'border-primary text-primary'}`}
                      onClick={() => handleToggleAdmin(user.id, !!user.isSpaceAdmin)}
                    >
                      {user.isSpaceAdmin ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                    <button
                      className="px-2 py-1 rounded text-xs font-semibold border border-danger text-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center items-center gap-4 mt-2">
        <Pagination
          disableCursorAnimation
          showControls
          className="gap-2"
          initialPage={1}
          radius="full"
          total={totalPages}
          variant="light"
          page={page}
          onChange={setPage}
        />
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={() => { setUserToDelete(null); onClose(); }}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Eliminar usuario</ModalHeader>
              <ModalBody>
                <p>¿Seguro que quieres eliminar este usuario?</p>
                {userToDelete && (
                  <>
                    <p className="text-xs text-default-600 mt-1">
                      Usuario: <b>{userToDelete.username}</b>
                    </p>
                    <p className="text-xs text-default-600 mt-1">
                      Email: <b>{userToDelete.email}</b>
                    </p>
                    <p className="text-xs text-default-600 mt-1">
                      Nombre: <b>{userToDelete.name} {userToDelete.lastName}</b>
                    </p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={() => { setUserToDelete(null); close(); }}>
                  No eliminar
                </Button>
                <Button className="bg-[#db4664] text-white" onPress={confirmDeleteUser}>
                  Eliminar usuario
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}