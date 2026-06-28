import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthHeader from "@/components/ui/AuthHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { requestOtp } from "@/features/auth/api";

function SignInForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const mutation = useMutation({
    mutationFn: (email) => requestOtp(email),
    onSuccess: (_, email) => {
      navigate("/verify-email", { state: { email } });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to send code. Please try again.";
      toast.error(message);
    },
  });

  function onSubmit({ email }) {
    mutation.mutate(email);
  }

  return (
    <AuthLayout>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-6"
      >
        <AuthHeader
          heading="Welcome to Votex"
          subHeading="Enter your email to receive a login code"
        />

        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
        />

        <Button
          name={mutation.isPending ? "Sending code..." : "Send Login Code"}
          disabled={mutation.isPending}
        />

        <p className="font-medium text-primary text-sm md:text-base">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-muted hover:text-primary hover:underline transition-all duration-300 ease-in-out"
          >
            Sign up
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}

export default SignInForm;
