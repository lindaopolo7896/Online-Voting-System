import { Mail, Bell, BellRing, BarChart2, Clock } from "lucide-react";
import Card from "../../../components/ui/Card";

const NOTIFICATION_OPTIONS = [
  {
    key: "inviteOnPublish",
    icon: Mail,
    label: "Send voter invitations",
    description:
      "Email every enrolled participant a personalised voting link when the election is published.",
  },
  {
    key: "reminderOneDayBefore",
    icon: Clock,
    label: "One-day reminder",
    description:
      "Send a reminder email to participants who haven't voted 24 hours before voting opens.",
  },
  {
    key: "notifyOnStart",
    icon: BellRing,
    label: "Notify when voting opens",
    description:
      "Alert all participants the moment the voting period begins.",
  },
  {
    key: "notifyOnClose",
    icon: Bell,
    label: "Notify when voting closes",
    description:
      "Send a notification to all participants when the voting period ends.",
  },
  {
    key: "sendResults",
    icon: BarChart2,
    label: "Email results after close",
    description:
      "Automatically send a results summary to all participants once the election is closed.",
  },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NotificationsStep({
  notifications,
  setNotifications,
  onBack,
  onSubmit,
  isSubmitting,
  submitLabel = "Create Election",
}) {
  function toggle(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const enabledCount = Object.values(notifications).filter(Boolean).length;

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text">
          Notifications &amp; Reminders
        </h2>
        <p className="mt-1 text-sm text-muted">
          Choose which automated emails to send to participants. You can adjust
          these later from the election settings.
        </p>
        {enabledCount > 0 && (
          <p className="mt-2 text-xs text-primary font-medium">
            {enabledCount} notification{enabledCount !== 1 ? "s" : ""} enabled
          </p>
        )}
      </div>

      <ul className="space-y-3">
        {NOTIFICATION_OPTIONS.map(({ key, icon: Icon, label, description }) => {
          const isOn = !!notifications[key];
          return (
            <li
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                isOn
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:bg-background"
              }`}
            >
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isOn ? "bg-primary/15 text-primary" : "bg-background text-muted"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="mt-0.5 text-xs text-muted">{description}</p>
              </div>

              <div className="mt-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Toggle checked={isOn} onChange={() => toggle(key)} />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-lg border border-border px-6 py-2 text-text text-sm hover:bg-background transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-6 py-2 text-white text-sm hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Election..." : submitLabel}
        </button>
      </div>
    </Card>
  );
}

export default NotificationsStep;
