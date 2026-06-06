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
        className="  w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-6 shadow-2xl "
      >
        <div className="flex flex-col gap-1 ">
          <h1 className="text-2xl font-bold text-white">Create New Password</h1>
          <p className="font-semibold text-[#6F7995]">
            Create a strong password
          </p>
        </div>

        <label htmlFor="" className="flex flex-col gap-3 text-white">
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
              className="border border-white/10 bg-[#0F1117]/70 rounded-lg py-2 placeholder:font-normal text-[#6F7995] focus:border-[#144DEF] focus:shadow-xl focus:shadow-[#144DEF]/15 focus:outline-none w-full px-3"
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
        <label htmlFor="" className="flex flex-col gap-3 text-white">
          Confirm Password
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="border border-white/10 bg-[#0F1117]/70 rounded-lg py-2 placeholder:font-normal text-[#6F7995] focus:border-[#144DEF] focus:shadow-xl focus:shadow-[#144DEF]/15 focus:outline-none w-full px-3"
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
