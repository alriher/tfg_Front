import { now } from "@internationalized/date";

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
                                        

export function isPhoneValidation(phone: string) {
  const phoneRegex = /^\d{9}$/;
  return phoneRegex.test(phone);
}




