import React from "react";
import SVG from "../assets/bg-auth.png";

function AuthLayout({ children }) {
  return (
    <div
      style={{ backgroundImage: `url(${SVG})` }}
      className="bg-cover bg-center min-h-screen flex items-center justify-center flex-col"
    >
      {children}
    </div>
  );
}

export default AuthLayout;
