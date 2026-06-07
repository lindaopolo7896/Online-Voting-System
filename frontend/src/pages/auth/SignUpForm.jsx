import AuthLayout from "../../layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import AuthHeader from "../../components/ui/AuthHeader";

function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  function onSubmit(data) {
    console.log(data);
    reset();
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="  w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-6 shadow-2xl "
      >
        <AuthHeader
          heading="Welcome to Votex"
          subHeading="Sign in to manage your elections"
        />

        <Input
          type="name"
          label="Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...register("name", {
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
        <PasswordInput
          label="Password"
          placeholder="Setup your password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be a minimum of 8 characters",
            },
          })}
        />
        <Button name="Sign Up" />
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
