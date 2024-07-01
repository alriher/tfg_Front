import { now, parseDateTime } from "@internationalized/date";

export function isAfterControlValidation(time: any, controls: any) {
  console.log("isAfterValidation", time, controls);
  return controls > time;
}

export function isAfterNowValidation(selectedTime: any) {
  const comparisonTime = now("Europe/Madrid");
  return selectedTime.compare(comparisonTime) >= 0;
}

export function isBeforeValidation(selectedTime: any, comparisonTime: any) {
  return selectedTime.compare(comparisonTime) <= 0;
}
