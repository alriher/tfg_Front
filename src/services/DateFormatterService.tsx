import { DateFormatter } from "@internationalized/date";

// Create a new DateFormatter instance with the timezone "Europe/Madrid" to formate dates to dd/MM/yyyy
const dateFormatter = new DateFormatter("es-ES", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export default function useDateFormatter() {
  return dateFormatter;
}