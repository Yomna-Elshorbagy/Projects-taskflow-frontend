import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../Apis/AuthApis";

export const useGetAllUsers = (token: string) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(token),
    enabled: !!token,
  });
};
