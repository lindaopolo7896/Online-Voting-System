import { useForm } from "react-hook-form";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import AuthHeader from "../../components/ui/AuthHeader";

function ForgotPasword() {
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

  const navigate = useNavigate();

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-4"
      >
        <div
          className="p-2 w-10 h-10 rounded-full border border-primary flex justify-center items-center cursor-pointer hover:bg-primary/30 transition-all duration-300 ease-in-out"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          <IoChevronBackOutline className="text-2xl text-white" />
        </div>
        <AuthHeader
          heading="Forgot Password"
          subHeading=" Enter email used below to proceed"
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

        <Button name="Proceed" />
      </form>
    </AuthLayout>
  );
}

export default ForgotPasword;
