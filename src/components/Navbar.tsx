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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isActiveRoute = (route: string) => {
    return window.location.pathname === route;
  };

  const mobileMenu: IMenuItem[] = [
    { item: "Inicio", route: "/home" },
    { item: "Comunidades", route: "/communities" },
    { item: "Contacto", route: "/contact" },
    { item: "Iniciar sesión", route: "/login" },
    { item: "Regístrate", route: "/sign-up" },
  ];

  const menuItems: IMenuItem[] = [
    { item: "Inicio", route: "/home" },
    { item: "Comunidades", route: "/communities" },
    { item: "Contacto", route: "/contact" },
  ];

  return (
    <Navbar
      className={isActiveRoute("/login") ? "absolute" : ""}
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
                src="../public/logo.webp"
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
      </NavbarContent>
      <NavbarContent justify="end">
        {user ? (
          <ProfileAvatar user={user} logout={logout} />
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link className="underline underline-offset-2" href="/login">
                Iniciar sesión
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                className="font-semibold"
                href="/sign-up"
              >
                Regístrate
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {mobileMenu.map((item, index) => (
          <NavbarMenuItem key={`${item.item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href={item.route}
              size="lg"
            >
              {item.item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
