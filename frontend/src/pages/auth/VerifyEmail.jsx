import { useForm } from "react-hook-form";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import Button from "../../components/ui/Button";
import VerificationCountdown from "../../helpers/VerificationCountdown";
import AuthHeader from "../../components/ui/AuthHeader";

function VerifyEmail({ email }) {
  const { register, handleSubmit, reset } = useForm({ mode: "onChange" });
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    e.target.value = value.slice(-1);

    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  function onSubmit(data) {
    console.log(data);
    reset();
  }

  const navigate = useNavigate();
  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="  w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-4 shadow-2xl "
      >
        <div
          className="p-2 w-[40px] h-[40px] rounded-full border border-primary flex justify-center items-center cursor-pointer hover:bg-primary/30 transition-all duration-300 ease-in-out"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          <IoChevronBackOutline className="text-2xl text-white" />
        </div>
        <AuthHeader
          heading="Verify Email"
          subHeading="Verify your email to continue"
        />

        <label
          htmlFor=""
          className="flex flex-col gap-3  font-semibold my-10 items-center justify-center"
        >
          <p className="text-center text-muted font-normal">
            Enter the <span className="text-primary">5 digits code</span> sent
            to your email <span className="text-primary">{email}</span>
            below
          </p>
          <div className="flex gap-5">
            {[0, 1, 2, 3, 4].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                {...register(`code${index}`, { required: true })}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-13 h-13 text-center  border border-border bg-surface rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-2xl text-primary"
              />
            ))}
          </div>
          <p className="flex items-center justify-center gap-1 text-text font-normal">
            Code expires in :
            <VerificationCountdown />
          </p>
          <p className="font-normal text-muted">
            Didn't get code?{" "}
            <span className="text-primary hover:text-primary/90 hover:underline transition-all duration-300 ease-in-out cursor-pointer">
              Resend Code
            </span>
          </p>
        </label>

        <Button name="Verify Email" />
      </form>
    </AuthLayout>
  );
}

export default VerifyEmail;
