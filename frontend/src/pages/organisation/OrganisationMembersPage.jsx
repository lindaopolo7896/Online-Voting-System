import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MembersTable from "@/features/members/components/MembersTable";
import MemberStats from "@/features/voters/components/MemberStats";
import useDashboard from "@/hooks/useDashboard";
import { getMemberships } from "@/api/organisationApi";

function OrganisationMembersPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Members");
    setSubtitle("Manage your organisation members");
  }, [setPageTitle, setSubtitle]);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["memberships"],
    queryFn: getMemberships,
  });

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-5">
      <MemberStats members={members} />
      <MembersTable members={members} isLoading={isLoading} />
    </div>
  );
}

export default OrganisationMembersPage;
