import React from "react";
import SVG from "../assets/bg.png";

function AuthLayout({ children }) {
  return (
    <div
      style={{ backgroundImage: `url(${SVG})` }}
      className="bg-gray-50 bg-cover bg-center min-h-screen flex items-center justify-center flex-col"
    >
      {children}
    </div>
  );
}

export default AuthLayout;
