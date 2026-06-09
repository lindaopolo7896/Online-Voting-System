import { useState } from "react";

import ElectionStepper from "../../features/elections/create-election/ElectionStepper";
import ElectionInfoStep from "../../features/elections/create-election/ElectionInfoStep";
import PositionsStep from "../../features/elections/create-election/PositionsStep";
import CandidatesStep from "../../features/elections/create-election/CandidatesStep";
import ElectionSummary from "../../features/elections/create-election/ElectionSummary";

function CreateElectionPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    timezone: "",
  });

  const [positions, setPositions] = useState([
    "President",
    "Vice President",
    "Secretary",
  ]);

  const [candidates, setCandidates] = useState({});

  return (
    <div className="flex flex-col gap-5 p-5">
      <ElectionStepper currentStep={currentStep} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Step 1 */}
        {currentStep === 1 && (
          <ElectionInfoStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <PositionsStep
            positions={positions}
            setPositions={setPositions}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <CandidatesStep
            positions={positions}
            candidates={candidates}
            setCandidates={setCandidates}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {/* Summary */}
        <ElectionSummary
          formData={formData}
          positions={positions}
          candidates={candidates}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}

export default CreateElectionPage;
