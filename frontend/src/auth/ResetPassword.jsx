import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/auth/Button";
import ShowPassword from "../components/ShowPassword";
import { useForm } from "react-hook-form";
import { useState } from "react";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [show, setShow] = useState(false);

  const password = watch("password");

  function onSubmit(data) {
    console.log(data);
    reset();
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-white w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-4 shadow-2xl "
      >
        <div className="flex flex-col gap-1 ">
          <h1 className="text-2xl font-bold text-[#111827]">
            Create New Password
          </h1>
          <p className="font-semibold text-black/50">
            Create a strong password
          </p>
        </div>

        <label
          htmlFor=""
          className="flex flex-col gap-3 text-[#111827] font-semibold"
        >
          Create Password
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be  a minimum of 8 characters",
                },
              })}
              className="w-full pr-10 border-b-2 p-3 placeholder:font-normal text-black/60 focus:border-b-[#144DEF] focus:outline-none "
              placeholder="Create new password"
            />
            <ShowPassword show={show} setShow={setShow} />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 font-normal">
              {errors.password.message}
            </p>
          )}
        </label>
        <label
          htmlFor=""
          className="flex flex-col gap-3 text-[#111827] font-semibold"
        >
          Confirm Password
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full pr-10 border-b-2 p-3 placeholder:font-normal text-black/60 focus:border-b-[#144DEF] focus:outline-none "
              placeholder="Confirm new password"
            />
            <ShowPassword show={show} setShow={setShow} />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 font-normal">
              {errors.confirmPassword.message}
            </p>
          )}
        </label>
        <Button name="Reset Password" />
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
