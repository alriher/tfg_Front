import moment from "moment";

export function convertDateToUTCISO(date: string): string {
  return moment(date).utc().toISOString();
}

export function formatDateToLocal(date: string): Date {
  return moment(date).local().toDate();
}