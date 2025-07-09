import moment from "moment-timezone";

export function convertDateToUTCISO(date: string): string {
  return moment.tz(date, 'Europe/Madrid').utc().toISOString();
}

export function formatDateToLocal(date: string): Date {
  return moment(date).local().toDate();
}