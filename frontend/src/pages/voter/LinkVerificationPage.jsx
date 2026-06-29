import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import MailIcon from "@/assets/icons/mail.png";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthLayout from "@/components/layout/AuthLayout";
import { requestOtp } from "@/features/auth/api";

function LinkVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (value) => requestOtp(value, token),
    onSuccess: () => {
      navigate("/voter-verification/code", {
        state: { email: email.trim().toLowerCase(), voting_token: token },
      });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Couldn't send the code. Please try again.",
      );
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    mutation.mutate(value);
  }

  // No token in the URL — the link is malformed.
  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-4 max-w-md items-center justify-center text-center">
          <h1 className="text-text text-2xl font-bold">Invalid voting link</h1>
          <p className="text-muted">
            This link is missing its access token. Please open the exact link
            from your invitation email, or contact your election admin.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 max-w-lg w-full items-center"
      >
        <img src={MailIcon} alt="mail icon" className="w-20 h-20" />
        <h1 className="text-text text-3xl font-bold text-center">
          Verify it's you
        </h1>
        <p className="text-muted text-center">
          Enter the email address your voting invitation was sent to. We'll send
          a one-time code to confirm it's really you before you vote.
        </p>

        <div className="w-full">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            error={error}
          />
        </div>

        <Button
          name={mutation.isPending ? "Sending code…" : "Send code"}
          disabled={mutation.isPending}
        />

        <p className="text-muted text-center text-sm">
          For your security this link is unique to you and should not be shared
          with anyone.
        </p>
      </form>
    </AuthLayout>
  );
}

export default LinkVerificationPage;
