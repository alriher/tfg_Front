import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { IMenuItem } from "../interfaces/menuItem";
import { useAuth } from "../providers/AuthProvider";
import ProfileAvatar from "./ProfileAvatar";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import SpaceAdminSidebar from "./SpaceAdminSidebar";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log('USER EN NAVBAR:', user);
  const isActiveRoute = (route: string) => {
    return window.location.pathname === route;
  };

  const mobileMenu: IMenuItem[] = [
    { item: "Inicio", route: "/home" },
    { item: "Comunidades", route: "/communities" },
    { item: "Reservas", route: "/bookings" },
    { item: "Contacto", route: "/contact" },
    { item: "Iniciar sesión", route: "/login" },
    { item: "Regístrate", route: "/register" },
  ];

  const menuItems: IMenuItem[] = [
    { item: "Inicio", route: "/home" },
    { item: "Comunidades", route: "/communities" },
    { item: "Reservas", route: "/bookings" },
    { item: "Contacto", route: "/contact" },
  ];

  function handleLoginNavigate(): void {
    navigate("/login", { state: { from: window.location.pathname } });
  }

  function handleSignUpNavigate(): void {
    navigate("/register", { state: { from: window.location.pathname } });
  }

  return (
    <Navbar
      className={isActiveRoute("/login") || isActiveRoute("/register") ? "absolute" : ""} 
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-secondary",
        ],
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/home">
            <div className="size-16 flex items-center">
              <img
                src="/logo.webp"
                alt="Logo"
                className="object-cover"
              />
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem
            isActive={isActiveRoute(item.route)}
            key={`${item.item}-${index}`}
          >
            <Link
              color={isActiveRoute(item.route) ? "primary" : "foreground"}
              href={item.route}
            >
              {item.item}
            </Link>
          </NavbarItem>
        ))}
        <div className="flex">
          {user?.isSpaceAdmin && <SpaceAdminSidebar />}
          {user?.isAdmin && <AdminSidebar />}
        </div>
      </NavbarContent>
      
      <NavbarContent justify="end">
        {user ? (
          <ProfileAvatar user={user} logout={logout} />
        ) : (
          <>
            <NavbarItem className="hidden sm:flex">
              <Link
                className="underline underline-offset-2 cursor-pointer"
                onPress={handleLoginNavigate}
              >
                Iniciar sesión
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                className="font-semibold "
                onPress={handleSignUpNavigate}
              >
                Regístrate
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {mobileMenu
          .filter(item => {
            // Oculta "Iniciar sesión" y "Regístrate" si el usuario está logueado
            if (user && (item.item === "Iniciar sesión" || item.item === "Regístrate")) return false;
            return true;
          })
          .map((item, index) => (
            <NavbarMenuItem key={`${item.item}-${index}`}>
              <Link
                color={isActiveRoute(item.route) ? "primary" : "foreground"}
                className="w-full"
                href={item.route}
                size="lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.item}
              </Link>
            </NavbarMenuItem>
          ))}
          {user?.isSpaceAdmin && (
          <NavbarMenuItem>
            <SpaceAdminSidebar onItemClick={() => setIsMenuOpen(false)} />
          </NavbarMenuItem>
        )}
        {user?.isAdmin && (
          <NavbarMenuItem>
            <AdminSidebar onItemClick={() => setIsMenuOpen(false)} />
          </NavbarMenuItem>
        )}
        
      </NavbarMenu>
    </Navbar>
  );
}
