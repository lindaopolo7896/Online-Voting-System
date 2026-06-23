import { useQuery } from "@tanstack/react-query";
import { getMyMemberships, getMembershipPermissions } from "../api/permissionsApi";

export function useMyPermissions() {
  const {
    data: memberships = [],
    isLoading: membershipsLoading,
    isError: membershipsError,
  } = useQuery({
    queryKey: ["my-memberships"],
    queryFn: getMyMemberships,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Case-insensitive ADMIN check, fallback to first membership
  const myMembership =
    memberships.find((m) => m.role?.toUpperCase() === "ADMIN") ??
    memberships[0] ??
    null;

  const {
    data: permissionRecords = [],
    isLoading: permsLoading,
    isError: permsError,
  } = useQuery({
    queryKey: ["my-permissions", myMembership?.id],
    queryFn: () => getMembershipPermissions(myMembership.id),
    enabled: !!myMembership?.id,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const isLoading = membershipsLoading || permsLoading;
  const isError = membershipsError || permsError;

  // Support codename in multiple possible field names from the API
  const codenames = new Set(
    permissionRecords.map((p) => p.codename ?? p.permission_codename ?? p.permission ?? ""),
  );

  return {
    hasPermission: (codename) => codenames.has(codename),
    myMembershipId: myMembership?.id ?? null,
    isLoading,
    isError,
  };
}
