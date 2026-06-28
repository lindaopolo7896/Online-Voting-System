import AuthLayout from "@/components/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthHeader from "@/components/ui/AuthHeader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useRegisterOrganisation } from "@/hooks/useRegisterOrganisation";

function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const registerOrganisation = useRegisterOrganisation();
  const navigate = useNavigate();

  function onSubmit(data) {
    registerOrganisation.mutate(data, {
      onSuccess: () => {
        toast.success("Account created. We sent a code to your email.");

        reset();

        navigate("/verify-email", { state: { email: data.email } });
      },

      onError: (error) => {
        const data = error?.response?.data;
        const msg =
          data?.detail ||
          data?.message ||
          (typeof data === "string" ? data : null) ||
          "Registration failed";
        toast.error(msg);
      },
    });
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="  w-full max-w-xl m-auto rounded-xl flex flex-col p-10 gap-6  "
      >
        <AuthHeader
          heading="Welcome to Votex"
          subHeading="Sign up to manage your elections"
        />

        <Input
          type="text"
          label="Institution Name"
          placeholder="Enter your name"
          error={errors.organisation_name?.message}
          {...register("organisation_name", {
            required: "Name is required",
          })}
        />
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email address"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid Email Format",
            },
          })}
        />
        <Button
          name={registerOrganisation.isPending ? "Signing Up..." : "Sign Up"}
          disabled={registerOrganisation.isPending}
        />
        <p className="font-medium text-primary">
          Have an Account?{" "}
          <Link
            to="/sign-in"
            className="text-muted hover:text-primary/90 hover:underline transition-all duration-300 ease-in-out"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default SignUpForm;
