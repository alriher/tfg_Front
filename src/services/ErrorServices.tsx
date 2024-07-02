import es from "../errors/es.json";
import Mustache from "mustache";
import { ErrorTypes } from "../interfaces/errorType";

const messages: any = {
  ...es,
};

export function getErrorMessage(
  error: string | undefined,
  variables = {}
): string {
  if (!error) return "Error desconocido";
  const key = error as keyof typeof ErrorTypes;
  const message = messages[ErrorTypes[key]] || "Error desconocido";
  return Mustache.render(message, variables).replace(/&#x2F;/g, "/");
}
