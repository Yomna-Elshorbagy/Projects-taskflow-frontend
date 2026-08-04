import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../Apis/AuthApis";
import { useAppSelector } from "../Store/store";
import type { UpdateProfileData } from "../Interfaces/IUser";
import Swal from "sweetalert2";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(token as string),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(token as string, data),
    onSuccess: (res) => {
      queryClient.setQueryData(["profile"], res);
      Swal.fire({
        title: "Success",
        text: "Profile updated successfully!",
        icon: "success",
        confirmButtonColor: "#1a6b5a",
        timer: 3000,
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to update profile",
        icon: "error",
        confirmButtonColor: "#1a6b5a",
      });
    },
  });

  return {
    profile: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
