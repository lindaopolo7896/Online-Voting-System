import Card from "@/components/ui/Card";

const steps = [
  {
    id: 1,
    title: "Election Information",
    subtitle: "Basic details",
  },
  {
    id: 2,
    title: "Positions",
    subtitle: "Add election positions",
  },
  {
    id: 3,
    title: "Participants",
    subtitle: "Upload participants",
  },
  {
    id: 4,
    title: "Candidates",
    subtitle: "Assign candidates",
  },
  {
    id: 5,
    title: "Notifications",
    subtitle: "Email & reminders",
  },
];

function ElectionStepper({ currentStep }) {
  return (
    <Card className="rounded-xl border-white/10 p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const active = currentStep === step.id;
          const completed = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold
                  ${
                    active
                      ? "bg-primary text-white"
                      : completed
                        ? "bg-green-500 text-white"
                        : "bg-muted/30 text-text"
                  }`}
                >
                  {step.id}
                </div>

                <div>
                  <p className="text-sm font-medium">{step.title}</p>

                  <p className="text-xs text-muted">{step.subtitle}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="mx-4 h-px flex-1 bg-muted/20" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ElectionStepper;
