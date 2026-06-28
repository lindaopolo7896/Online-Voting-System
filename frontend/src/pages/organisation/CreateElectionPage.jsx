import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import {
  createElection,
  createPosition,
  createParticipant,
  bulkUploadParticipants,
} from "@/api/organisationApi";

import ElectionStepper from "@/features/elections/components/create-election/ElectionStepper";
import ElectionInfoStep from "@/features/elections/components/create-election/ElectionInfoStep";
import PositionsStep from "@/features/elections/components/create-election/PositionsStep";
import ParticipantsStep from "@/features/elections/components/create-election/ParticipantsStep";
import CandidatesStep from "@/features/elections/components/create-election/CandidatesStep";
import NotificationsStep from "@/features/elections/components/create-election/NotificationsStep";
import ElectionSummary from "@/features/elections/components/create-election/ElectionSummary";

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

  // Set after the election is created at the step 3 → 4 transition.
  const [createdElectionId, setCreatedElectionId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Called when the admin clicks "Save & Continue" on ParticipantsStep (step 3).
  // Creates the election, positions, participants, and bulk-uploads the file so
  // that the CandidatesStep (step 4) can fetch real participant IDs from the API.
  async function handleCreateAndUpload() {
    setIsCreating(true);
    try {
      // 1. Create election
      const election = await createElection({
        name: formData.title.trim(),
        description: formData.description?.trim() || "",
        date_time_occuring: new Date(formData.startDate).toISOString(),
        date_time_ending: new Date(formData.endDate).toISOString(),
        organisation_id: user.organisationId,
      });

      // 2. Create positions
      //    (the backend seeds the creator's election permissions automatically
      //    when the election is created — no client-side permission assignment.)
      const nonEmptyPositions = positions.filter((p) => p.trim());
      for (const posName of nonEmptyPositions) {
        await createPosition(election.id, {
          name: posName.trim(),
          organisation_id: user.organisationId,
          election_id: election.id,
        });
      }

      // 3. Enroll selected existing org members as participants
      for (const membershipId of selectedMemberIds) {
        await createParticipant(election.id, { membership_id: membershipId });
      }

      // 4. Bulk upload CSV/XLSX file (creates users + memberships server-side).
      //    Any uploaded participant can be registered as a candidate next.
      if (participantsFile) {
        await bulkUploadParticipants(election.id, participantsFile);
      }

      queryClient.invalidateQueries({ queryKey: ["elections"] });
      setCreatedElectionId(election.id);
      setCurrentStep(4);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to create election. Please try again.";
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  }

  // Called from the final Notifications step — election already exists.
  function handleFinish() {
    toast.success("Election created successfully!");
    navigate("/organisation/elections");
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

        {/* Step 3 — Participants (existing members + file upload).
            "Save & Continue" triggers election creation so step 4 has a real ID. */}
        {currentStep === 3 && (
          <ParticipantsStep
            selectedMemberIds={selectedMemberIds}
            setSelectedMemberIds={setSelectedMemberIds}
            participantsFile={participantsFile}
            setParticipantsFile={setParticipantsFile}
            onBack={() => setCurrentStep(2)}
            onNext={handleCreateAndUpload}
            isCreating={isCreating}
          />
        )}

        {/* Step 4 — Candidates: assign uploaded candidate participants to positions */}
        {currentStep === 4 && (
          <CandidatesStep
            electionId={createdElectionId}
            onNext={() => setCurrentStep(5)}
          />
        )}

        {/* Step 5 — Notifications: election already created, just finish */}
        {currentStep === 5 && (
          <NotificationsStep
            notifications={notifications}
            setNotifications={setNotifications}
            onBack={() => setCurrentStep(4)}
            onSubmit={handleFinish}
            isSubmitting={false}
            submitLabel="Finish"
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
