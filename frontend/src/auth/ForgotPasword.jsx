import React from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/auth/Button";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="font-semibold text-[#6F7995]">
            Enter email used below to proceed
          </p>
        </div>

        <label htmlFor="" className="flex flex-col gap-3 text-white">
          Email
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid Email Format",
              },
            })}
            className="border border-white/10 bg-[#0F1117]/70 rounded-lg py-2 placeholder:font-normal text-[#6F7995] focus:border-[#144DEF] focus:shadow-xl focus:shadow-[#144DEF]/15 focus:outline-none w-full px-3"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-sm text-red-500 font-normal">
              {errors.email.message}
            </p>
          )}
        </label>

        <Button name="Proceed" />
      </form>
    </AuthLayout>
  );
}

export default ForgotPasword;
