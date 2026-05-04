import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useForm } from "react-hook-form";
import Button from "../components/auth/Button";
import { Link } from "react-router-dom";
import ShowPassword from "../components/ShowPassword";
import { useState } from "react";

function SignInForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [show, setShow] = useState(false);

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
            Welcome to Votex
          </h1>
          <p className="font-semibold text-black/50">
            Sign in to manage your elections
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
        <label
          htmlFor=""
          className="flex flex-col gap-3 text-[#111827] font-semibold "
        >
          Password
          <div className="relative w-full">
            <input
              type={show ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be  a minimum of 8 characters",
                },
              })}
              className="w-full border-b-2 py-2 pr-10 placeholder:font-normal text-black/60 focus:border-b-[#144DEF] focus:outline-none"
              placeholder="Setup your password"
            />
            <ShowPassword show={show} setShow={setShow} />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 font-normal">
              {errors.password.message}
            </p>
          )}
        </label>
        <Button name="Sign In" />
        <div className="flex justify-between">
          <p className="font-medium">
            Don't Have an Account?{" "}
            <Link
              to="/sign-up"
              className="text-[#144DEF] hover:text-[#144DEF]/90 hover:underline transition-all duration-300 ease-in-out"
            >
              Sign up
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="text-black/70 font-medium hover:text-[#144DEF] transition-all duration-300 ease-in-out"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default SignInForm;
