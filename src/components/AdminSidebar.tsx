import React from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const adminLinks = [
  { label: "Usuarios", route: "/admin/users" },
  { label: "Reservas", route: "/admin/bookings" },
  { label: "Espacios", route: "/admin/spaces" },
  // Añade más enlaces según tus necesidades
];

// Añade la prop onItemClick para cerrar el menú móvil al pulsar un botón
export default function AdminSidebar({ onItemClick }: { onItemClick?: () => void } = {}) {
  const navigate = useNavigate();
  return (
    <>
      {/* Accordion solo visible en móvil */}
      <div className="sm:hidden min-w-[200px]">
        <Accordion variant="light" isCompact className="p-0 text-large" itemClasses={{content: "text-large"}}>
          <AccordionItem key="admin" aria-label="Admin" title={<span className="text-danger text-large">Admin</span>}>
            <div className="flex flex-col gap-1">
              {adminLinks.map((link) => (
                <Button
                  key={link.route}
                  variant="light"
                  color={window.location.pathname === link.route ? "primary" : "default"}
                  className="justify-start text-medium"
                  onClick={() => {
                    navigate(link.route);
                    onItemClick && onItemClick();
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      {/* Dropdown solo visible en desktop */}
      <div className="hidden sm:block">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" color="danger" className="text-medium">
              Admin
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Opciones de administración"
            variant="light"
          >
            {adminLinks.map((link) => (
              <DropdownItem
                key={link.route}
                onClick={() => navigate(link.route)}
                className="text-large"
              >
                {link.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}