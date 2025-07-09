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

const spaceAdminLinks = [
  { label: "Crear espacio", route: "/space-admin/create-space" },
  { label: "Mis espacios", route: "/space-admin/my-spaces" },
  // Puedes añadir más enlaces según necesidades
];

export default function SpaceAdminSidebar({ onItemClick }: { onItemClick?: () => void } = {}) {
  const navigate = useNavigate();
  return (
    <>
      {/* Accordion solo visible en móvil */}
      <div className="sm:hidden min-w-[200px]">
        <Accordion variant="light" isCompact className="p-0 text-large" itemClasses={{content: "text-large"}}>
          <AccordionItem key="space-admin" aria-label="SpaceAdmin" title={<span className="text-primary text-large">Espacios</span>}>
            <div className="flex flex-col gap-1">
              {spaceAdminLinks.map((link) => (
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
            <Button variant="light" color="primary" className="text-medium">
              Espacios
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Opciones de espacios"
            variant="light"
          >
            {spaceAdminLinks.map((link) => (
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
