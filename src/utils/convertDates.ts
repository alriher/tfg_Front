import { convertDateToUTCISO, formatDateToLocal } from './utils';

export function convertirFechasAUTC(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertirFechasAUTC);
  } else if (obj !== null && typeof obj === "object") {
    const nuevo: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value instanceof Date) {
        console.log(`Converting Date to UTC ISO for key: ${key}`);
        nuevo[key] = convertDateToUTCISO(value.toISOString());
      } else if (typeof value === "string" && isISODateString(value)) {
        console.log(`Converting ISO date string to UTC ISO for key: ${key}`);
        nuevo[key] = convertDateToUTCISO(value);
      } else {
        console.log(`Recursively converting key: ${key}`);
         // Recursivamente convertir objetos anidados
        nuevo[key] = convertirFechasAUTC(value);
      }
    }
    return nuevo;
  }
  return obj;
}

export function convertirFechasADate(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertirFechasADate);
  } else if (obj !== null && typeof obj === "object") {
    const nuevo: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "string" && isISODateString(value)) {
        nuevo[key] = formatDateToLocal(value);
      } else {
        nuevo[key] = convertirFechasADate(value);
      }
    }
    return nuevo;
  }
  return obj;
}

// Helper para detectar strings ISO 8601 en formato UTC
function isISODateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(value);
}