import { now } from "@internationalized/date";
import { today } from "@internationalized/date";
import type { CalendarDate } from "@internationalized/date";

export function isAfterControlValidation(time: any, controls: any) {
  console.log("isAfterValidation", time, controls);
  return controls > time;
}

export function isAfterNowValidation(selectedTime: any) {
  const comparisonTime = now("Europe/Madrid");
  return selectedTime.compare(comparisonTime) >= 0;
}

export function isAfterOrEqualToday(selectedDate: CalendarDate) {
  const todayDate = today("Europe/Madrid");
  const result =
    selectedDate.year > todayDate.year ||
    (selectedDate.year === todayDate.year && selectedDate.month > todayDate.month) ||
    (selectedDate.year === todayDate.year && selectedDate.month === todayDate.month && selectedDate.day >= todayDate.day);
  return result;
}

export function isBeforeValidation(selectedTime: any, comparisonTime: any) {
  return selectedTime.compare(comparisonTime) <= 0;
}

export function isEmailValidation(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function passwordHasNumberValidation(password: string) {
  const passwordRegex = /\d/;
  return passwordRegex.test(password);
}
export function passwordHasUppercaseValidation(password: string) {
  const passwordRegex = /[A-Z]/;
  return passwordRegex.test(password);
}
export function passwordHasLowercaseValidation(password: string) {
  const passwordRegex = /[a-z]/;
  return passwordRegex.test(password);
}
export function passwordHasSpecialCharacterValidation(password: string) {
  const passwordRegex = /[^A-Za-z0-9]/;
  return passwordRegex.test(password);
}

export function confirmPasswordValidation(password: string, confirmPassword: string) {
  return password === confirmPassword;
}


export function isPhoneValidation(phone: string) {
  const phoneRegex = /^\d{9}$/;
  return phoneRegex.test(phone);
}

export function isPhone9DigitsValidation(phone: string) {
  if (!phone) return true;
  return /^\d{9}$/.test(phone);
}

export function isNotTooOldValidation(selectedDate: CalendarDate) {
  const todayDate = today("Europe/Madrid");
  const minYear = todayDate.year - 100;
  // Si el año de nacimiento es menor que el mínimo permitido, es inválido
  return selectedDate.year >= minYear;
}




