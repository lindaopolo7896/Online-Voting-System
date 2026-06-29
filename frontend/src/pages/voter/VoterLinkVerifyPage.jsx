import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion, useAnimation } from "framer-motion";
import { IoChevronBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthHeader from "@/components/ui/AuthHeader";
import Button from "@/components/ui/Button";
import { requestOtp, verifyOtp } from "@/features/auth/api";
import VerificationCountdown from "@/components/common/VerificationCountdown";
import maskEmail from "@/utils/maskEmail";
import {
  buildVotingSession,
  saveVotingSession,
} from "@/features/voting/session";

const OTP_LENGTH = 6;

function VoterLinkVerifyPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const votingToken = state?.voting_token;

  useEffect(() => {
    if (!email || !votingToken) {
      navigate("/sign-in", { replace: true });
    }
  }, [email, votingToken, navigate]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdownKey, setCountdownKey] = useState(0);
  const inputRefs = useRef([]);
  const shakeControls = useAnimation();

  function handleChange(value, index) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    setOtpError("");
    const lastIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIdx]?.focus();
  }

  const verifyMutation = useMutation({
    mutationFn: ({ email, otp }) =>
      verifyOtp({ email, otp, voting_token: votingToken }),
    onSuccess: (data) => {
      if (data?.access) localStorage.setItem("access_token", data.access);
      if (data?.refresh) localStorage.setItem("refresh_token", data.refresh);

      if (!data?.eligibility?.eligible) {
        setOtpError("You are not eligible to vote with this link.");
        return;
      }

      saveVotingSession(buildVotingSession(data, votingToken));
      navigate("/voting-details", { replace: true });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid or expired code. Please try again.";
      setOtpError(message);
      shakeControls.start({
        x: [0, -8, 8, -8, 8, 0],
        transition: { duration: 0.4 },
      });
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => requestOtp(email, votingToken),
    onSuccess: () => {
      toast.success("A new code has been sent to your email.");
      setCountdownKey((k) => k + 1);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Could not resend code. Please try again.";
      toast.error(message);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setOtpError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    verifyMutation.mutate({ email, otp: code });
  }

  if (!email || !votingToken) return null;

  return (
    <AuthLayout>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-6"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 w-10 h-10 rounded-full border border-primary flex justify-center items-center cursor-pointer hover:bg-primary/20 transition-all duration-300 ease-in-out self-start"
        >
          <IoChevronBackOutline className="text-2xl text-white" />
        </button>

        <AuthHeader
          heading="Confirm it's you"
          subHeading={`Enter the 6-digit code sent to ${maskEmail(email)} to verify your identity for this election`}
        />

        <div className="flex flex-col items-center gap-4 my-4">
          <motion.div animate={shakeControls} className="flex gap-3 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-14 text-center text-2xl font-bold border rounded-xl bg-surface text-text focus:outline-none transition-all duration-200
                  ${
                    otpError
                      ? "border-error focus:border-error focus:shadow-[0_0_12px_rgba(220,38,38,0.2)]"
                      : "border-border focus:border-primary focus:shadow-[0_0_12px_rgba(20,77,239,0.2)]"
                  }`}
              />
            ))}
          </motion.div>

          {otpError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-sm text-center"
            >
              {otpError}
            </motion.p>
          )}

          <p className="flex items-center gap-1 text-muted text-sm">
            Code expires in: <VerificationCountdown key={countdownKey} />
          </p>

          <p className="text-muted text-sm">
            Didn't get the code?{" "}
            <button
              type="button"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending}
              className="text-primary hover:text-primary/80 hover:underline transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendMutation.isPending ? "Sending..." : "Resend Code"}
            </button>
          </p>
        </div>

        <Button
          name={verifyMutation.isPending ? "Verifying..." : "Verify & Continue"}
          disabled={
            verifyMutation.isPending || otp.join("").length < OTP_LENGTH
          }
        />
      </motion.form>
    </AuthLayout>
  );
}

export default VoterLinkVerifyPage;
