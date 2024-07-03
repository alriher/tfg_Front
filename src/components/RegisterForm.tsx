import { Button, DatePicker, Input, toggle } from "@nextui-org/react";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { getErrorMessage } from "../services/ErrorServices";
import EyeFilledIcon from "./EyeFilledIcon";
import EyeSlashFilledIcon from "./EyeSlashFilledIcon";
import { cn } from "../utils/cn";
import { CalendarDate, today } from "@internationalized/date";
import { isBeforeValidation } from "../services/ValidationService";


interface IUserRegisterFormInput {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    name: string;
    lastName: string;
    birthdate: CalendarDate; // deberia ser string
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
    } = useForm<IUserRegisterFormInput>(
        {
            defaultValues: {
                birthdate: today("Europe/Madrid")
            },
        }
    );

    const password = watch("password", "");
    const [formError, setFormErrors] = React.useState<string>("");
    const onSubmit: SubmitHandler<IUserRegisterFormInput> = (data) =>
        
        register(data.email, data.password, data.username, data.name, data.lastName, data.birthdate.toString(), data.address, data.phone)
            .then(() => {
                const { from } = location.state || { from: { pathname: "/home" } };
                navigate(from);
            })
            .catch((error) => {
                setFormErrors("register" + error.response.status);
                setValue("password", "", { shouldValidate: true });
            });
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex gap-4 flex-col mb-4"
                >
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: true }}
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
                                    placeholder="Enter your password"
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
                    <div className={cn({ hidden: formError.length == 0 })}></div>
                    <div className={cn({ hidden: formError.length == 0 })}>
                        {formError.length != 0 ? (
                            <span className="text-danger">{getErrorMessage(formError)}</span>
                        ) : null}
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: true,
                                validate: (value) =>
                                    value === password || "Las contraseñas no coinciden",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
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
                                            onClick={() => toggleVisibility()}
                                        >
                                            {isVisible ? (
                                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                />
                            )}
                        />
                    </div>
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
                            rules={{ required: true }}
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
                            rules={{ required: true }}
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
                                required: false,
                                validate: {
                                    isBefore: (value) =>
                                        isBeforeValidation(
                                            value,
                                            today("Europe/Madrid").add({ years: -18 })
                                        ),
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
                            rules={{ required: false }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    label="Phone"
                                    placeholder="Enter your phone"
                                />
                            )}
                        />
                    </div>
                    <Button color="primary" className="font-semibold" type="submit">
                        Register
                    </Button>
                    <div className={formError.length == 0 ? "hidden" : ""}>
                        <span className="text-danger">{getErrorMessage(formError)}</span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
