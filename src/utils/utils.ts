import moment from "moment";
import momentTz from "moment-timezone"

export function convertDateToUTCISO(date: string): string {
  console.log(`Converting date to UTC ISO: ${date}`);
  return moment(date).utc().toISOString();
}

export function formatDateToLocal(date: string): Date {
  return moment(date).local().toDate();
}

export function combineDayAndHourIntoUTC(day: string, hour: string): string {
  const combined = `${day} ${hour}`;
  const dateMadrid = momentTz.tz(combined, 'YYYY-MM-DD HH:mm', 'Europe/Madrid');
  return dateMadrid.utc().toISOString();
}