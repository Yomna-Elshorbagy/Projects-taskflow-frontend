import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { signupSchema, type SignupSchemaType } from "../Utils/Schema/SignupSchema";
import { userSignup } from "../Apis/AuthApis";
import { insertUserData } from "../Store/Slices/AuthSlice";
import { useAppDispatch } from "../Store/store";
import FormInput from "../Components/FormInput";
import AuthPanel from "../Components/AuthPanel";
import SubmitButton from "../Components/SubmitButton";
import SEO from "../Shared/SEO/SEO";

function SignupPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: userSignup,
        onSuccess: (data) => {
            if (data.accessToken) {
                dispatch(
                    insertUserData({ token: data.accessToken, user: data.data })
                );
                Swal.fire({
                    icon: "success",
                    title: "Account Created!",
                    text: data.message || "Welcome to TaskFlow 🎉",
                    confirmButtonColor: "#1a6b5a",
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate("/");
            }
        },
        onError: (error: unknown) => {
            const message =
                (error as { response?: { data?: { message?: string } } })?.response
                    ?.data?.message ?? "Something went wrong. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text: message,
                confirmButtonColor: "#1a6b5a",
            });
        },
    });

    const onSubmit = (data: SignupSchemaType) => {
        mutate(data);
    };

    return (
        <>
            <SEO
                title="Sign Up | TaskFlow"
                description="Create a TaskFlow account and start managing your projects and tasks."
                keywords="TaskFlow signup, register, create account, project management"
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
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Start organising your team's work in minutes.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 w-full max-w-md"
                        noValidate
                    >
                        {/* Full Name */}
                        <FormInput
                            id="userName"
                            label="Full name"
                            placeholder="Jane Doe"
                            autoComplete="name"
                            error={errors.userName}
                            {...register("userName")}
                        />

                        {/* Email */}
                        <FormInput
                            id="email"
                            label="Work email"
                            type="email"
                            placeholder="you@company.com"
                            autoComplete="email"
                            error={errors.email}
                            {...register("email")}
                        />

                        {/* Password */}
                        <FormInput
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                            error={errors.password}
                            {...register("password")}
                        />

                        {/* Confirm Password */}
                        <FormInput
                            id="Cpassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            error={errors.Cpassword}
                            {...register("Cpassword")}
                        />

                        {/* Gender */}
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="gender"
                                className="text-sm font-medium text-gray-700"
                            >
                                Gender
                            </label>
                            <select
                                id="gender"
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all bg-white
                ${errors.gender
                                        ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                        : "border-gray-300 focus:border-[#1a6b5a] focus:ring-2 focus:ring-[#1a6b5a]/30"
                                    }`}
                                {...register("gender")}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.gender && (
                                <p className="text-xs text-red-600 font-medium">
                                    {errors.gender.message}
                                </p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <FormInput
                            id="mobileNumber"
                            label="Mobile Number"
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            autoComplete="tel"
                            error={errors.mobileNumber}
                            {...register("mobileNumber")}
                        />

                        {/* Submit */}
                        <SubmitButton
                            id="signup-submit-btn"
                            label="Create account"
                            loadingLabel="Creating account"
                            isLoading={isPending}
                        />
                    </form>

                    {/* Login link */}
                    <p className="mt-6 text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-[#1a6b5a] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* ── Right Panel: Marketing ── */}
                <AuthPanel />
            </div>
        </>
    );
}

export default SignupPage;