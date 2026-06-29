import { useNavigate, useLocation } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";

// Shown after a ballot is submitted. The voter is not logged into any dashboard —
// to view results later they sign in separately.
function VoteConfirmationPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const txHash = state?.txHash ?? null;

  return (
    <AuthLayout>
      <div className="w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-6 items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center bg-success h-16 w-16 rounded-full">
          <TiTick className="text-white text-[44px]" />
        </div>

        <h1 className="text-3xl font-bold text-text">Vote submitted!</h1>

        <p className="text-muted md:w-7/8">
          Your vote has been securely recorded. Thank you for participating in this
          election. You can close this page now.
        </p>

        {txHash && (
          <div className="w-full rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-muted mb-1">Confirmation reference</p>
            <p className="text-sm text-text font-mono break-all">{txHash}</p>
          </div>
        )}

        <p className="text-muted text-sm">
          Want to see the results once they're published? Sign in to view the
          elections you've participated in.
        </p>

        <button className="w-full" onClick={() => navigate("/sign-in")}>
          <Button name="Sign in to view results" />
        </button>
      </div>
    </AuthLayout>
  );
}

export default VoteConfirmationPage;
