import React from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import Button from "../components/auth/Button";
import Countdown from "../helpers/CountDown";
import VerificationCountdown from "../helpers/VerificationCountdown";

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
          className="p-2 w-[40px] h-[40px] rounded-full border border-[#144DEF] flex justify-center items-center cursor-pointer hover:bg-[#144DEF]/30 transition-all duration-300 ease-in-out"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          <IoChevronBackOutline className="text-2xl text-white" />
        </div>
        <div className="flex flex-col gap-1 ">
          <h1 className="text-2xl font-bold text-white">Verify Email</h1>
          <p className="font-semibold text-[#6F7995]">
            Verify your email to continue
          </p>
        </div>

        <label
          htmlFor=""
          className="flex flex-col gap-3  font-semibold my-10 items-center justify-center"
        >
          <p className="text-center text-white font-normal">
            Enter the <span className="text-[#144DEF]">5 digits code</span> sent
            to your email <span className="text-[#144DEF]">{email}</span>
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
                className="w-13 h-13 text-center  border border-white/10 bg-[#0F1117]/70 rounded-md focus:ring-2 focus:ring-[#144DEF] focus:outline-none text-2xl text-[#144DEF]"
              />
            ))}
          </div>
          <p className="flex items-center justify-center gap-1 text-white font-normal">
            Code expires in :
            <VerificationCountdown />
          </p>
          <p className="font-normal text-[#6F7995]">
            Didn't get code?{" "}
            <span className="text-[#144DEF] hover:text-[#144DEF]/90 hover:underline transition-all duration-300 ease-in-out cursor-pointer">
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
