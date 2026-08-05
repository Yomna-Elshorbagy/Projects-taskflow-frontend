import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import FormInput from "../Components/FormInput";
import SubmitButton from "../Components/SubmitButton";
import { profileSchema, type ProfileSchemaType } from "../Utils/Schema/ProfileSchema";
import { useProfile } from "../Hooks/useProfile";
import SEO from "../Shared/SEO/SEO";

/* ── small helper: coloured pill badge ───────────────────────── */
function Badge({ label, color }: { label: string; color: "green" | "blue" | "amber" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[color]}`}>
      {label}
    </span>
  );
}

/* ── read-only info row ───────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 transition-colors hover:bg-[#1a6b5a]/5">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-gray-200">
        <Icon className="h-4 w-4 text-[#1a6b5a]" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p className="truncate text-sm font-semibold text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, isLoading, isError, updateProfile, isUpdating } = useProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        userName: profile.userName || "",
        mobileNumber: profile.mobileNumber || "",
        address: profile.address || "",
        gender: profile.gender || "male",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileSchemaType) => {
    try {
      await updateProfile(data);
      reset(data); // reset dirty state after save
    } catch {
      // error handled via Swal inside the hook
    }
  };

  /* ─── avatar initials ─────────────────────────── */
  const initials = profile?.userName
    ? profile.userName
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "?";

  /* ─── loading skeleton ────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f4f7f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#1a6b5a]/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#1a6b5a]" />
          </div>
          <p className="text-sm font-medium text-gray-400">Loading your profile…</p>
        </div>
      </div>
    );
  }

  /* ─── error state ─────────────────────────────── */
  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f4f7f6]">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-white p-10 shadow-sm">
          <span className="text-4xl">⚠️</span>
          <p className="text-base font-semibold text-gray-700">Could not load your profile</p>
          <p className="text-sm text-gray-400">Please refresh the page and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="TaskFlow — My Profile"
        description="View and update your TaskFlow profile information."
      />

      {/* ── page wrapper ── */}
      <div className="h-full overflow-y-auto bg-[#f4f7f6] px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* ── page header ── */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a6b5a]/10">
              <UserCircle className="h-5 w-5 text-[#1a6b5a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-400">Manage your personal information</p>
            </div>
          </div>

          {/* ── top row: avatar card + account info ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">

            {/* avatar card — 2 cols */}
            <div className="relative col-span-2 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-gray-100">
              {/* subtle gradient blob */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#1a6b5a]/8 blur-3xl"
              />

              {/* avatar */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1a6b5a] to-[#2d9b80] text-3xl font-bold text-white shadow-lg ring-4 ring-white">
                {initials}
                <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </span>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{profile?.userName}</p>
                <p className="text-sm text-gray-400">{profile?.email}</p>
              </div>

              {/* badges */}
              <div className="flex flex-wrap justify-center gap-2">
                <Badge label={profile?.role || "member"} color="green" />
                {profile?.isVerified && <Badge label="Verified" color="blue" />}
                <Badge label={profile?.gender || ""} color="amber" />
              </div>
            </div>

            {/* account info — 3 cols */}
            <div className="col-span-3 flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="mb-1 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1a6b5a]" />
                <h2 className="text-sm font-semibold text-gray-700">Account Information</h2>
              </div>

              <InfoRow icon={Mail} label="Email address" value={profile?.email} />
              <InfoRow icon={Phone} label="Mobile number" value={profile?.mobileNumber} />
              <InfoRow icon={MapPin} label="Address" value={profile?.address} />
              <InfoRow icon={Users} label="Gender" value={profile?.gender} />
            </div>
          </div>

          {/* ── edit form card ── */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            {/* card header */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a6b5a]/10">
                <Pencil className="h-4 w-4 text-[#1a6b5a]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Edit Profile</h2>
                <p className="text-xs text-gray-400">Changes are saved immediately to the server</p>
              </div>
              {isDirty && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600 ring-1 ring-amber-200">
                  Unsaved changes
                </span>
              )}
            </div>

            {/* form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6" noValidate>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormInput
                  label="Full Name"
                  id="profile-userName"
                  type="text"
                  placeholder="e.g. Ahmed Hassan"
                  autoComplete="name"
                  {...register("userName")}
                  error={errors.userName}
                />

                {/* email — read only */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                    <span className="ml-1.5 text-xs font-normal text-gray-400">(read-only)</span>
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 outline-none"
                    aria-readonly="true"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormInput
                  label="Mobile Number"
                  id="profile-mobileNumber"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  autoComplete="tel"
                  {...register("mobileNumber")}
                  error={errors.mobileNumber}
                />

                {/* gender select */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="profile-gender" className="text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="profile-gender"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all
                      ${errors.gender
                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300"
                        : "border-gray-300 bg-white focus:border-[#1a6b5a] focus:ring-2 focus:ring-[#1a6b5a]/30"
                      }`}
                    {...register("gender")}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-xs font-medium text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              <FormInput
                label="Address"
                id="profile-address"
                type="text"
                placeholder="e.g. 123 Nile St, Cairo"
                autoComplete="street-address"
                {...register("address")}
                error={errors.address}
              />

              {/* footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <p className="text-xs text-gray-400">
                  Last updated: {profile ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </p>
                <SubmitButton
                  id="profile-save-btn"
                  label="Save Changes"
                  loadingLabel="Saving…"
                  isLoading={isUpdating}
                  disabled={!isDirty}
                  className="w-auto px-8"
                />
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
