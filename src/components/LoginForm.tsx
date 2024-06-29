import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input, Link } from "@nextui-org/react";
import EyeFilledIcon from "./EyeSlashFilledIcon";
import EyeSlashFilledIcon from "./EyeSlashFilledIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { IUserFormInput, useAuth } from "../providers/AuthProvider";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit } = useForm<IUserFormInput>();
  const onSubmit: SubmitHandler<IUserFormInput> = (data) =>
    login(data.email, data.password).then(() => {
      const { from } = location.state || { from: { pathname: "/home" } };
      navigate(from);
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
            <Input
              {...register("email")}
              type="email"
              label="Email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <Input
              {...register("password")}
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
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
          </div>

          <Button color="primary" className="font-semibold" type="submit">
            Iniciar Sesión
          </Button>
        </form>
        <div>
          <Link>¿Olvidaste la contraseña?</Link>
          <p>
            ¿No tienes cuenta? <Link>Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
