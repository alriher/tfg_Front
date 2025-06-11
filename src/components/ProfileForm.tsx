import { Avatar, Button, DatePicker, Input } from "@nextui-org/react";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAuth } from "../providers/AuthProvider";
import { getErrorMessage } from "../services/ErrorServices";
import { updateUserProfile, changeUserPassword } from "../services/UserService";
import { CalendarDate, today, parseDate } from "@internationalized/date";
import { confirmPasswordValidation, isPhone9DigitsValidation, isNotTooOldValidation, isBeforeValidation, isEmailValidation, passwordHasLowercaseValidation, passwordHasNumberValidation, passwordHasSpecialCharacterValidation, passwordHasUppercaseValidation } from "../services/ValidationService";


interface IUserProfileFormInput {
  email: string;
  username: string;
  name: string;
  lastName: string;
  birthdate: CalendarDate;
  address: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ProfileForm = () => {
  const { user, setUser } = useAuth();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<IUserProfileFormInput>({
    defaultValues: {
      name: user?.name || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      birthdate: user?.birthdate ? parseDate(user.birthdate) : undefined,
      address: user?.address || ""
    },
  });

  const [formError, setFormErrors] = React.useState<string>("");
  const [success, setSuccess] = React.useState(false);

  const onSubmit: SubmitHandler<IUserProfileFormInput> = async (data) => {
    if (!user) return;
    try {
      setFormErrors("");
      setSuccess(false);
      // Convertir birthdate a string YYYY-MM-DD si existe
      const birthdateStr = data.birthdate
        ? `${data.birthdate.year}-${String(data.birthdate.month).padStart(2, "0")}-${String(data.birthdate.day).padStart(2, "0")}`
        : undefined;
      const response = await updateUserProfile(user.id, { ...data, birthdate: birthdateStr });
      setSuccess(true);
      if (response && response.user) {
        setUser && setUser(response.user);
        sessionStorage.setItem("user", JSON.stringify(response.user));
      }
    } catch (error: any) {
      setSuccess(false);
      setFormErrors(
        error?.response?.data?.message || "Error al actualizar el perfil"
      );
    }
  };

  // useForm para el formulario de cambio de contraseña
  const {
    handleSubmit: handlePasswordSubmit,
    control: controlPassword,
    formState: { errors: errorsPassword },
    setError: setPasswordError,
    setValue: setPasswordValue,
    reset: resetPasswordForm,
    watch: watchPassword,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = watchPassword("newPassword", "");
  const [passwordError, setPasswordErrorMsg] = React.useState("");
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isVisible2, setIsVisible2] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  const onPasswordSubmit = async (data: any) => {
    setPasswordSuccess(false);
    setPasswordErrorMsg("");
    if (data.newPassword !== data.confirmNewPassword) {
      setPasswordError("confirmNewPassword", { type: "confirmPasswordValidation", message: "Las contraseñas no coinciden" });
      setPasswordValue("newPassword", "", { shouldValidate: true });
      setPasswordValue("confirmNewPassword", "", { shouldValidate: true });
      return;
    }
    if (!user) return;
    try {
      await changeUserPassword(Number(user.id), data.currentPassword, data.newPassword);
      setPasswordSuccess(true);
      resetPasswordForm();
    } catch (error: any) {
      setPasswordErrorMsg(error?.response?.data?.message || "Error al cambiar la contraseña");
      setPasswordValue("currentPassword", "", { shouldValidate: true });
      setPasswordValue("newPassword", "", { shouldValidate: true });
      setPasswordValue("confirmNewPassword", "", { shouldValidate: true });
    }
  };

  return (
    <div className="px-6 mt-4 gap-8 container grid grid-cols-1 md:grid-cols-3 m-auto">
      <div className="w-full flex items-center gap-4 md:col-span-3">
        <Avatar
          color="primary"
          isBordered
          as="button"
          className="md:w-24 md:h-24 w-12 h-12 text-large transition-transform"
          showFallback
          name={user?.username}
        />
        <span className="md:text-4xl text-lg font-bold text-gray-800">
          Mi perfil
        </span>
      </div>
      <hr className="md:col-span-3 w-full border-gray-300" />
      <div className="flex w-full justify-between text-md md:text-2xl font-bold text-gray-600">
        <span>Información personal</span>
        <div className="border-r-1 h-full w-[1px] border-gray-300 hidden md:block"></div>
      </div>
      <form
        className="grid md:grid-cols-2 gap-x-4 gap-y-8 md:col-span-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Controller
          control={control}
          name="name"
          rules={{ required: false }}
          render={({ field }) => (
            <Input
              {...field}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Introduce tu nombre"
              type="text"
              isInvalid={!!errors.name}
              errorMessage={getErrorMessage(errors.name?.type, {
                field: "nombre",
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          rules={{ required: false }}
          render={({ field }) => (
            <Input
              {...field}
              label="Apellidos"
              labelPlacement="outside"
              placeholder="Introduce tus apellidos"
              type="text"
              isInvalid={!!errors.lastName}
              errorMessage={getErrorMessage(errors.lastName?.type, {
                field: "apellidos",
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          rules={{
            required: false,
            validate: {
              isPhone9DigitsValidation: (value) => isPhone9DigitsValidation(value)
            }
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Número de teléfono"
              labelPlacement="outside"
              placeholder="Introduce tu número de teléfono"
              type="text"
              className="md:col-span-2"
              isInvalid={!!errors.phone}
              errorMessage={getErrorMessage(errors.phone?.type, { field: "teléfono" })}
            />
          )}
        />
        <Controller
          control={control}
          name="birthdate"
          rules={{
            required: true,
            validate: {
              isBefore: (value) =>
                isBeforeValidation(
                  value,
                  today("Europe/Madrid").add({ years: -18 })
                ),
              isNotTooOld: (value) =>
                isNotTooOldValidation(value),
            },
          }}
          render={({ field }) => (
            <DatePicker
              {...field}
              isInvalid={!!errors.birthdate}
              maxValue={today("Europe/Madrid")}
              minValue={today("Europe/Madrid").add({ years: -100 })}
              hideTimeZone
              className="md:col-span-2"
              label="Fecha de nacimiento"
              errorMessage={getErrorMessage(errors.birthdate?.type, {
                field: "fecha de nacimiento",
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          rules={{ required: false }}
          render={({ field }) => (
            <Input
              {...field}
              label="Dirección"
              labelPlacement="outside"
              placeholder="Introduce tu dirección"
              type="text"
              className="md:col-span-2"
              isInvalid={!!errors.address}
              errorMessage={getErrorMessage(errors.address?.type, {
                field: "dirección",
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: true,
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Introduce un correo válido",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Correo electrónico"
              labelPlacement="outside"
              placeholder="tucorreo@ejemplo.com"
              type="email"
              className="md:col-span-2"
              isInvalid={!!errors.email}
              errorMessage={
                errors.email
                  ? getErrorMessage(errors.email.type, {
                      field: "correo electrónico",
                    }) || errors.email.message
                  : undefined
              }
              disabled // Si quieres permitir edición, elimina esta línea
            />
          )}
        />
        <div className="flex md:col-span-2">
          <Button type="submit" color="primary">
            Guardar cambios
          </Button>
        </div>
        {formError && (
          <div className="md:col-span-2 text-danger text-sm mt-2">
            {formError}
          </div>
        )}
        {success && (
          <div className="md:col-span-2 text-success text-sm mt-2">
            ¡Perfil actualizado correctamente!
          </div>
        )}
      </form>
      <hr className="md:col-span-3 w-full border-gray-300" />
      <div className="flex w-full justify-between text-md md:text-2xl font-bold text-gray-600">
        <span>Contraseña</span>
        <div className="border-r-1 h-full w-[1px] border-gray-300 hidden md:block"></div>
      </div>
      <form className="grid md:grid-cols-2 gap-x-4 gap-y-8 md:col-span-2" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
        <Controller
          control={controlPassword}
          name="currentPassword"
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              label="Contraseña actual"
              labelPlacement="outside"
              placeholder="Introduce tu contraseña"
              type="password"
              className="md:col-span-2"
              isInvalid={!!errorsPassword.currentPassword}
              errorMessage={errorsPassword.currentPassword && "Campo obligatorio"}
            />
          )}
        />
        <Controller
          control={controlPassword}
          name="newPassword"
          rules={{
            required: true,
            minLength: 8,
            validate: {
              passwordHasLowercaseValidation,
              passwordHasNumberValidation,
              passwordHasSpecialCharacterValidation,
              passwordHasUppercaseValidation,
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Nueva contraseña"
              labelPlacement="outside"
              placeholder="Introduce tu nueva contraseña"
              type={isVisible ? "text" : "password"}
              className="md:col-span-2"
              isInvalid={!!errorsPassword.newPassword}
              errorMessage={getErrorMessage(errorsPassword.newPassword?.type, {
                field: "contraseña",
                min: 8,
              })}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <span className="text-default-400 pointer-events-none size-6">👁️‍🗨️</span>
                  ) : (
                    <span className="text-default-400 pointer-events-none size-6">👁️</span>
                  )}
                </button>
              }
            />
          )}
        />
        <Controller
          control={controlPassword}
          name="confirmNewPassword"
          rules={{
            required: true,
            validate: {
              confirmPasswordValidation: (confirmPassword) => confirmPasswordValidation(newPassword, confirmPassword),
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Repite nueva contraseña"
              labelPlacement="outside"
              placeholder="Repite tu nueva contraseña"
              type={isVisible2 ? "text" : "password"}
              className="md:col-span-2"
              isInvalid={!!errorsPassword.confirmNewPassword}
              errorMessage={getErrorMessage(errorsPassword.confirmNewPassword?.type, {
                field: "confirmar contraseña",
              })}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility2}
                >
                  {isVisible2 ? (
                    <span className="text-default-400 pointer-events-none size-6">👁️‍🗨️</span>
                  ) : (
                    <span className="text-default-400 pointer-events-none size-6">👁️</span>
                  )}
                </button>
              }
            />
          )}
        />
        <div className="flex md:col-span-2">
          <Button type="submit" color="primary">
            Guardar cambios
          </Button>
        </div>
        {passwordError && (
          <div className="md:col-span-2 text-danger text-sm mt-2">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="md:col-span-2 text-success text-sm mt-2">
            ¡Contraseña cambiada correctamente!
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
