import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Input, Link } from "@nextui-org/react";
import EyeFilledIcon from "./EyeSlashFilledIcon";
import EyeSlashFilledIcon from "./EyeSlashFilledIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { getErrorMessage } from "../services/ErrorServices";
import { isEmailValidation } from "../services/ValidationService";

interface IUserFormInput {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    setError,
  } = useForm<IUserFormInput>();
  const onSubmit: SubmitHandler<IUserFormInput> = (data) =>
    login(data.email, data.password)
      .then(() => {
        const { from } = location.state || { from: { pathname: "/communities" } };
        navigate(from);
      })
      .catch((error) => {
        if (error.response.data.message == "User not found") {
          setError("email", {
            type: "userNotFound",
          });
        }
        if (error.response.data.message == "Invalid password") {
          setError("password", {
            type: "invalidPassword",
          });
        }

        // setFormErrors("login" + error.response.status);
        setValue("password", "", { shouldValidate: false });
      });
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
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
                  }
                }

              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  label="Email"
                  placeholder="Introduce tu email"
                  isInvalid={!!errors.email}
                  errorMessage={getErrorMessage(errors.email?.type, {
                    field: "email",
                  })}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="password"
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Contraseña"
                  variant="bordered"
                  placeholder="Introduce tu contraseña"
                  isInvalid={!!errors.password}
                  errorMessage={getErrorMessage(errors.password?.type, {
                    field: "contraseña",
                  })}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => toggleVisibility()}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  className="max-w-xs"
                />
              )}
            />
          </div>
          <Button color="primary" className="font-semibold" type="submit">
            Iniciar Sesión
          </Button>
        </form>
        <div>
          <Link>¿Olvidaste la contraseña?</Link>
          <p>
            ¿No tienes cuenta? <Link
              href="/register"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
