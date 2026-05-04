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
        className=" bg-white w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-4 shadow-2xl "
      >
        <div
          className="p-2 w-[40px] h-[40px] rounded-full bg-[#757575]/20 flex justify-center items-center cursor-pointer hover:bg-[#757575]/30 transition-all duration-300 ease-in-out"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          <IoChevronBackOutline className="text-2xl text-black/80" />
        </div>
        <div className="flex flex-col gap-1 ">
          <h1 className="text-2xl font-bold text-[#111827]">Forgot Password</h1>
          <p className="font-semibold text-black/50">
            Enter email used below to proceed
          </p>
        </div>

        <label
          htmlFor=""
          className="flex flex-col gap-3 text-[#111827] font-semibold"
        >
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
            className="border-b-2 py-2 placeholder:font-normal text-black/60 focus:border-b-[#144DEF] focus:outline-none "
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
