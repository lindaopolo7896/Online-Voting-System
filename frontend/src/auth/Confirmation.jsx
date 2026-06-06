import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/auth/Button";
import { useNavigate } from "react-router-dom";
import Success from "../assets/success.png";

function Confirmation() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <div className=" w-full max-w-lg m-auto rounded-xl flex flex-col p-10 gap-7 shadow-2xl items-center justify-center">
        <img src={Success} alt="success icon" srcset="" className="w-[60px] " />
        <h1 className="text-2xl font-bold text-white">Password Changed!</h1>
        <p className=" text-center text-[#6F7995] md:w-7/8">
          Your password has been reset succesfully. Click below to sign in
        </p>

        <button className="w-full" onClick={() => navigate("/sign-in")}>
          <Button name="Sign In" />
        </button>
      </div>
    </AuthLayout>
  );
}

export default Confirmation;
