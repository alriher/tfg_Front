import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

export default function App() {
  return (
    <div className="md:container md:mx-auto">
    <Card>
      <CardHeader className="flex gap-3">
        <Image
          alt="Icono representativo"
          height={40}
          radius="sm"
          src="URL_DE_TU_IMAGEN_REPRESENTATIVA"  // Sustituye con la URL de tu imagen
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">Nombre de Mi App</p>  // Cambia a nombre de tu aplicación
          <p className="text-small text-default-500">Tu dominio aquí</p>  // Tu URL o un subtítulo
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <p>Aquí explicas de manera concisa el propósito de tu sitio. Por ejemplo: "Gestiona y reserva espacios comunes de forma fácil y eficiente."</p>
      </CardBody>
      <Divider/>
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="URL_A_UN_RECURSO_IMPORTANTE"  // Enlace a un recurso clave, como documentación o contacto
        >
          Aprende más sobre cómo usar nuestra app
        </Link>
      </CardFooter>
    </Card>
    </div>
  );
}
