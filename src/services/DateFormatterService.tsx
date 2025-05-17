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

export function toLocalISOString(date: Date) {
  return date.getFullYear() +
    "-" + String(date.getMonth() + 1).padStart(2, "0") +
    "-" + String(date.getDate()).padStart(2, "0") +
    "T" + String(date.getHours()).padStart(2, "0") +
    ":" + String(date.getMinutes()).padStart(2, "0") +
    ":" + String(date.getSeconds()).padStart(2, "0");
}