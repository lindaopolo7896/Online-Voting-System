import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion, useAnimation } from "framer-motion";
import { IoChevronBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/AuthLayout";
import AuthHeader from "../../components/ui/AuthHeader";
import Button from "../../components/ui/Button";
import { requestOtp, verifyOtp } from "../../api/authApi";
import VerificationCountdown from "../../helpers/VerificationCountdown";
import maskEmail from "../../helpers/maskEmail";
import useAuth from "../../hooks/useAuth";

const OTP_LENGTH = 6;

function VerifyEmail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const votingToken = state?.voting_token;
  const { login } = useAuth();

  // Redirect back to sign-in if arrived without an email
  useEffect(() => {
    if (!email) navigate("/sign-in", { replace: true });
  }, [email, navigate]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdownKey, setCountdownKey] = useState(0);
  const inputRefs = useRef([]);
  const shakeControls = useAnimation();

  // OTP digit change
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

  // Paste full OTP at once
  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    setOtpError("");
    const lastIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIdx]?.focus();
  }

  // Verify OTP
  const verifyMutation = useMutation({
    mutationFn: ({ email, otp }) => verifyOtp({ email, otp, voting_token: votingToken }),
    onSuccess: (data) => {
      const access = data?.access ?? "";
      const refresh = data?.refresh ?? "";
      if (access) localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);

      const role = data?.membership?.role ?? "";
      const firstName = data?.user?.first_name ?? "";
      const lastName = data?.user?.last_name ?? "";
      login({
        id: data?.user?.id,
        name: `${firstName} ${lastName}`.trim() || data?.user?.email,
        email: data?.user?.email,
        role,
        membershipId: data?.membership?.id,
        organisationId: data?.membership?.organisation_id,
      });

      // Came in through a voting link → continue into the voting flow.
      if (votingToken) {
        navigate("/voting-details", { replace: true });
      } else if (role === "admin") {
        navigate("/organisation/dashboard", { replace: true });
      } else {
        navigate("/voter/dashboard", { replace: true });
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid or expired code. Please try again.";
      setOtpError(message);
      // Shake the OTP inputs
      shakeControls.start({
        x: [0, -8, 8, -8, 8, 0],
        transition: { duration: 0.4 },
      });
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    },
  });

  // Resend OTP
  const resendMutation = useMutation({
    mutationFn: () => requestOtp(email, votingToken),
    onSuccess: () => {
      toast.success("A new code has been sent to your email.");
      setCountdownKey((k) => k + 1); // re-mount countdown to reset timer
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

  if (!email) return null;

  return (
    <AuthLayout>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-6"
      >
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/sign-in")}
          className="p-2 w-10 h-10 rounded-full border border-primary flex justify-center items-center cursor-pointer hover:bg-primary/20 transition-all duration-300 ease-in-out self-start"
        >
          <IoChevronBackOutline className="text-2xl text-white" />
        </button>

        <AuthHeader
          heading="Verify Email"
          subHeading={`Enter the 6-digit code sent to ${maskEmail(email)}`}
        />

        {/* OTP inputs */}
        <div className="flex flex-col items-center gap-4 my-4">
          <motion.div animate={shakeControls} className="flex gap-3 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-14 text-center text-2xl font-bold border rounded-xl bg-surface text-text focus:outline-none transition-all duration-200
                  ${otpError
                    ? "border-error focus:border-error focus:shadow-[0_0_12px_rgba(220,38,38,0.2)]"
                    : "border-border focus:border-primary focus:shadow-[0_0_12px_rgba(20,77,239,0.2)]"
                  }`}
              />
            ))}
          </motion.div>

          {/* Inline error */}
          {otpError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-sm text-center"
            >
              {otpError}
            </motion.p>
          )}

          {/* Countdown */}
          <p className="flex items-center gap-1 text-muted text-sm">
            Code expires in: <VerificationCountdown key={countdownKey} />
          </p>

          {/* Resend */}
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
          name={verifyMutation.isPending ? "Verifying..." : "Verify & Sign In"}
          disabled={verifyMutation.isPending || otp.join("").length < OTP_LENGTH}
        />
      </motion.form>
    </AuthLayout>
  );
}

export default VerifyEmail;
