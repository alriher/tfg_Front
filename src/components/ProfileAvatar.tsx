import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { IUser } from "../interfaces/user";
import { useNavigate } from "react-router-dom";

export default function ProfileAvatar({
  user,
  logout,
}: {
  user: IUser;
  logout: () => void;
}) {

  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    }
  }
  return (
    <div className="flex items-center gap-4">
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            color="primary"
            isBordered
            as="button"
            className="transition-transform"
            showFallback
            name={user?.username}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Sesión iniciada como:</p>
            <p className="font-semibold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="profile">Mi perfil</DropdownItem>
          <DropdownItem
            className="text-danger"
            onPress={handleLogout}
            key="logout"
            color="danger"
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
