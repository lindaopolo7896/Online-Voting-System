import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import {
  createElection,
  createPosition,
  createParticipant,
  bulkUploadParticipants,
} from "../../api/organisationApi";
import { bulkAssignPermissions } from "../../api/permissionsApi";

import ElectionStepper from "../../features/elections/create-election/ElectionStepper";
import ElectionInfoStep from "../../features/elections/create-election/ElectionInfoStep";
import PositionsStep from "../../features/elections/create-election/PositionsStep";
import ParticipantsStep from "../../features/elections/create-election/ParticipantsStep";
import NotificationsStep from "../../features/elections/create-election/NotificationsStep";
import ElectionSummary from "../../features/elections/create-election/ElectionSummary";

// Org-level permission set that gives the admin all election-management rights.
// Used as a safety net because perform_create in ElectionViewset seeds these
// automatically, but silently skips if get_user_active_membership returns None.
// Using org-scope (election=null) avoids the swapped-args bug in the backend's
// election-scoped bulk_assign view.
const ADMIN_ORG_PERMISSIONS = [
  "add.organisation", "view.organisation", "update.organisation", "delete.organisation",
  "add.membership", "view.membership", "update.membership", "delete.membership",
  "assign.permission", "view.permission", "unassign.permission",
  "view.log", "delete.log",
  "add.election", "view.election", "update.election", "delete.election",
  "add.voting_link", "view.voting_link",
  "start.election", "close.election", "publish.results",
  "add.position", "view.position", "update.position", "delete.position",
  "add.participant", "view.participant", "update.participant", "delete.participant",
  "add.candidate", "view.candidate", "update.candidate", "delete.candidate",
  "approve.candidate", "reject.candidate",
  "view.results", "update.voting_link", "delete.voting_link",
];

function CreateElectionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [positions, setPositions] = useState([
    "President",
    "Vice President",
    "Secretary",
  ]);

  const [selectedMemberIds, setSelectedMemberIds] = useState(new Set());
  const [participantsFile, setParticipantsFile] = useState(null);

  const [notifications, setNotifications] = useState({
    inviteOnPublish: true,
    reminderOneDayBefore: false,
    notifyOnStart: true,
    notifyOnClose: false,
    sendResults: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!formData.title.trim()) {
      toast.error("Election title is required.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error("Start and end date are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create the election — perform_create on the backend seeds the
      //    creator's election-level permissions automatically.
      const election = await createElection({
        name: formData.title.trim(),
        description: formData.description?.trim() || "",
        date_time_occuring: new Date(formData.startDate).toISOString(),
        date_time_ending: new Date(formData.endDate).toISOString(),
        organisation_id: user.organisationId,
      });

      // 2. Safety net: expand the admin's org-level permissions to include
      //    all election-management rights so subsequent steps work even if
      //    perform_create silently skipped the seeding step.
      await bulkAssignPermissions({
        type: "organisation",
        membership_id: user.membershipId,
        permissions: ADMIN_ORG_PERMISSIONS,
      });

      // 3. Create positions
      const nonEmptyPositions = positions.filter((p) => p.trim());
      for (const posName of nonEmptyPositions) {
        await createPosition(election.id, {
          name: posName.trim(),
          organisation_id: user.organisationId,
          election_id: election.id,
        });
      }

      // 4. Enroll selected existing org members as participants
      for (const membershipId of selectedMemberIds) {
        await createParticipant(election.id, membershipId);
      }

      // 5. Bulk upload participants file (CSV/XLSX).
      //    The `role` column in the file determines each person's role:
      //      participant → voter
      //      candidate   → will stand for a position (assign via Candidates page)
      //      official    → election official
      //    New users and org memberships are created automatically by the backend.
      if (participantsFile) {
        const fd = new FormData();
        fd.append("file", participantsFile);
        await bulkUploadParticipants(election.id, fd);
      }

      queryClient.invalidateQueries({ queryKey: ["elections"] });
      toast.success("Election created successfully!");
      navigate("/organisation/elections");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to create election. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <ElectionStepper currentStep={currentStep} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Step 1 — Election Info */}
        {currentStep === 1 && (
          <ElectionInfoStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {/* Step 2 — Positions */}
        {currentStep === 2 && (
          <PositionsStep
            positions={positions}
            setPositions={setPositions}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {/* Step 3 — Participants (existing members + file upload) */}
        {currentStep === 3 && (
          <ParticipantsStep
            selectedMemberIds={selectedMemberIds}
            setSelectedMemberIds={setSelectedMemberIds}
            participantsFile={participantsFile}
            setParticipantsFile={setParticipantsFile}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {/* Step 4 — Notifications */}
        {currentStep === 4 && (
          <NotificationsStep
            notifications={notifications}
            setNotifications={setNotifications}
            onBack={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Summary sidebar */}
        <ElectionSummary
          formData={formData}
          positions={positions}
          selectedMemberIds={selectedMemberIds}
          participantsFile={participantsFile}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}

export default CreateElectionPage;
