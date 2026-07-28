import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { loginSchema, type LoginSchemaType } from "../Utils/Schema/LoginSchema";
import { userLogin } from "../Apis/AuthApis";
import { insertUserData } from "../Store/Slices/AuthSlice";
import { useAppDispatch } from "../Store/store";
import FormInput from "../Components/FormInput";
import AuthPanel from "../Components/AuthPanel";
import SubmitButton from "../Components/SubmitButton";
import SEO from "../Shared/SEO/SEO";

function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: userLogin,
        onSuccess: (data) => {
            if (data.accessToken) {
                dispatch(
                    insertUserData({ token: data.accessToken, user: data.data })
                );
                Swal.fire({
                    icon: "success",
                    title: "Welcome back!",
                    text: data.message || "Signed in successfully.",
                    confirmButtonColor: "#1a6b5a",
                    timer: 1800,
                    showConfirmButton: false,
                });
                navigate("/");
            }
        },
        onError: (error: unknown) => {
            const message =
                (error as { response?: { data?: { message?: string } } })?.response
                    ?.data?.message ?? "Invalid credentials. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: message,
                confirmButtonColor: "#1a6b5a",
            });
        },
    });

    const onSubmit = (data: LoginSchemaType) => {
        mutate(data);
    };

    return (
        <>
            <SEO
                title="Login | TaskFlow"
                description="Sign in to your TaskFlow account to manage your projects and tasks."
                keywords="TaskFlow login, project management login, task management"
            />
            <div className="min-h-screen flex">
                {/* ── Left Panel: Form ── */}
                <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 bg-white">
                    {/* Logo */}
                    <div className="mb-8 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1a6b5a] text-white font-bold text-sm">
                            T
                        </div>
                        <span className="text-xl font-semibold text-gray-900">TaskFlow</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Sign in to your TaskFlow workspace.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 w-full max-w-md"
                        noValidate
                    >
                        {/* Email */}
                        <FormInput
                            id="login-email"
                            label="Email"
                            type="email"
                            placeholder="sarah@taskflow.io"
                            autoComplete="email"
                            error={errors.email}
                            {...register("email")}
                        />

                        {/* Password row: label + Forgot link */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="login-password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-medium text-[#1a6b5a] hover:underline"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all
                placeholder:text-gray-400
                ${errors.password
                                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300"
                                        : "border-gray-300 bg-white focus:border-[#1a6b5a] focus:ring-2 focus:ring-[#1a6b5a]/30"
                                    }`}
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-600 font-medium">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <SubmitButton
                            id="login-submit-btn"
                            label="Sign in"
                            loadingLabel="Signing in"
                            isLoading={isPending}
                        />
                    </form>

                    {/* Signup link */}
                    <p className="mt-6 text-sm text-center text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-[#1a6b5a] hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                {/* ── Right Panel: Marketing ── */}
                <AuthPanel />
            </div>
        </>
    );
}

export default LoginPage;