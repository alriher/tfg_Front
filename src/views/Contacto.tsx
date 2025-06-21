import React from "react";

function Contacto() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Contacto</h1>
      <p className="mb-6 text-center max-w-xl">
        ¿Tienes alguna pregunta, sugerencia o necesitas soporte? ¡Estamos aquí para ayudarte!
        Puedes ponerte en contacto con nosotros a través de los siguientes medios:
      </p>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-6">
        <ul className="space-y-4">
          <li>
            <span className="font-semibold">Correo electrónico:</span> <a href="mailto:soporte@tfgespacios.com" className="text-blue-600 hover:underline">soporte@tfgespacios.com</a>
          </li>
          <li>
            <span className="font-semibold">Teléfono:</span> <a href="tel:+34960000000" className="text-blue-600 hover:underline">+34 960 00 00 00</a>
          </li>
          <li>
            <span className="font-semibold">Dirección:</span> Calle Ejemplo, 123, 46000 Valencia, España
          </li>
        </ul>
      </div>
      <p className="text-center text-gray-500 text-sm max-w-xl">
        Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00. También puedes consultar la sección de preguntas frecuentes para resolver dudas comunes.
      </p>
    </div>
  );
}

export default Contacto;
