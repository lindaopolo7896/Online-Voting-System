import { useForm } from "react-hook-form";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import AuthHeader from "../../components/ui/AuthHeader";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl m-auto rounded-xl flex flex-col p-10 gap-6"
      >
        <AuthHeader
          heading="Create New Password"
          subHeading="Create a strong password"
        />

        <PasswordInput
          label="Password"
          placeholder="Create new password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be a minimum of 8 characters",
            },
          })}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />

        <Button name="Reset Password" />
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
