import { Button, DatePicker, Input, Link } from "@nextui-org/react";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { getErrorMessage } from "../services/ErrorServices";
import EyeFilledIcon from "./EyeFilledIcon";
import EyeSlashFilledIcon from "./EyeSlashFilledIcon";
import { cn } from "../utils/cn";
import { CalendarDate, today } from "@internationalized/date";
import {
  confirmPasswordValidation,
  isBeforeValidation,
  isEmailValidation,
  passwordHasLowercaseValidation,
  passwordHasNumberValidation,
  passwordHasSpecialCharacterValidation,
  passwordHasUppercaseValidation,
  isPhone9DigitsValidation,
  isNotTooOldValidation,
} from "../services/ValidationService";

interface IUserRegisterFormInput {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  name: string;
  lastName: string;
  birthdate: CalendarDate;
  address: string;
  phone: string;
}

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    control,
    setError,
  } = useForm<IUserRegisterFormInput>({
    defaultValues: {
      birthdate: today("Europe/Madrid"),
    },
  });

  const password = watch("password", "");
  const [formError, setFormErrors] = React.useState<string>("");
  const onSubmit: SubmitHandler<IUserRegisterFormInput> = (data) =>
    register(
      data.email,
      data.password,
      data.username,
      data.name,
      data.lastName,
      data.birthdate.toString(),
      data.address,
      data.phone
    )
      .then(() => {
        const { from } = location.state || { from: { pathname: "/home" } };
        navigate(from);
      })
      .catch((error) => {
        console.log("AQUI", error);
        console.log("AQUI2", error.response);
        console.log("AQUI3", error.response.data);
        console.log("AQUI4", error.response.status);
        console.log("AQUI5", error.response.data.message);

        if (error.response.data.message == "User and email already exists") {
          setError("email", {
            type: "emailAlreadyExists",
          });
          setError("username", {
            type: "userAlreadyExists",
          });
          // setFormErrors(error.response.data.message);
          // console.log("AQUI6", formError);
        } else if (error.response.data.message == "User already exists") {
          setError("username", {
            type: "userAlreadyExists",
          });
        } else if (error.response.data.message == "Email already exists") {
          setError("email", {
            type: "emailAlreadyExists",
          });
        } else {
          setFormErrors("register" + error.response.status);
        }
        setValue("password", "", { shouldValidate: true });
        setValue("confirmPassword", "", { shouldValidate: true });
      });
  const [isVisible, setIsVisible] = React.useState(false);
  const [isVisible2, setIsVisible2] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
          className="flex gap-4 flex-col mb-4"
        >
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
                validate: {
                  isEmailValidation: (value) => {
                    return isEmailValidation(value);
                  },
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  isInvalid={!!errors.email}
                  errorMessage={getErrorMessage(errors.email?.type, {
                    field: "email",
                  })}
                />
              )}
            />
          </div>

          {/* <div className={cn({ hidden: formError.length == 0 })}>
                        {formError.length != 0 ? (
                            <span className="text-danger">{getErrorMessage(formError)}</span>
                        ) : null}
                    </div> */}
          <div>
            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
                minLength: 8,
                validate: {
                  passwordHasLowercaseValidation:
                    passwordHasLowercaseValidation,
                  passwordHasNumberValidation: passwordHasNumberValidation,
                  passwordHasSpecialCharacterValidation:
                    passwordHasSpecialCharacterValidation,
                  passwordHasUppercaseValidation:
                    passwordHasUppercaseValidation,
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Contraseña"
                  variant="bordered"
                  placeholder="Enter your password"
                  errorMessage={getErrorMessage(errors.password?.type, {
                    field: "contraseña",
                    min: 8,
                  })}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => toggleVisibility()}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none size-6" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none size-6" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  className="max-w-xs"
                  isInvalid={!!errors.password}
                />
              )}
            />
          </div>
          {/* <div className={cn({ hidden: formError.length == 0 })}>
                        {formError.length != 0 ? (
                            <span className="text-danger">{getErrorMessage(formError)}</span>
                        ) : null}
                    </div> */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: true,
                validate: {
                  confirmPasswordValidation: (confirmPassword) =>
                    confirmPasswordValidation(password, confirmPassword),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type={isVisible2 ? "text" : "password"}
                  label="Confirmar contraseña"
                  placeholder="Enter your password again"
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={getErrorMessage(errors.confirmPassword?.type, {
                    field: "confirmar contraseña",
                  })}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => toggleVisibility2()}
                    >
                      {isVisible2 ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none size-6" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none size-6" />
                      )}
                    </button>
                  }
                />
              )}
            />
          </div>
          {/* <div className={cn({ hidden: formError.length == 0 })}>
                        {formError.length != 0 ? (
                            <span className="text-danger">{getErrorMessage(formError)}</span>
                        ) : null}
                    </div> */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Controller
              control={control}
              name="username"
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Username"
                  placeholder="Enter your username"
                  isInvalid={!!errors.username}
                  errorMessage={getErrorMessage(errors.username?.type, {
                    field: "username",
                  })}
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              rules={{ required: false }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Nombre"
                  placeholder="Enter your name"
                />
              )}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Controller
              control={control}
              name="lastName"
              rules={{ required: false }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Last Name"
                  placeholder="Enter your last name"
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
                  isNotTooOld: (value) => isNotTooOldValidation(value),
                },
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  isInvalid={!!errors.birthdate}
                  maxValue={today("Europe/Madrid")}
                  minValue={today("Europe/Madrid").add({ years: -100 })}
                  hideTimeZone
                  className="w-full"
                  errorMessage={getErrorMessage(errors.birthdate?.type, {
                    field: "fecha de nacimiento",
                  })}
                  label="Fecha de nacimiento"
                />
              )}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Controller
              control={control}
              name="address"
              rules={{ required: false }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Address"
                  placeholder="Enter your address"
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              rules={{
                required: false,
                validate: {
                  isPhone9DigitsValidation: (value) =>
                    isPhone9DigitsValidation(value),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Phone"
                  placeholder="Enter your phone"
                  isInvalid={!!errors.phone}
                  errorMessage={getErrorMessage(errors.phone?.type, {
                    field: "teléfono",
                  })}
                />
              )}
            />
          </div>
          <Button color="primary" className="font-semibold" type="submit">
            Register
          </Button>
          {/* <div className={formError.length == 0 ? "hidden" : ""}>
                        <span className="text-danger">{getErrorMessage(formError)}</span>
                    </div> */}
        </form>
        <div>
          <p>
            ¿Ya tienes cuenta? <Link href="/login">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
