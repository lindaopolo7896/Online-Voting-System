import React from "react";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";

function ShowPassword({ show, setShow }) {
  function toggle() {
    setShow((prev) => !prev);
  }
  return (
    <button
      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
      onClick={toggle}
    >
      {show ? (
        <BiHide className="text-xl text-[#6F7995]" />
      ) : (
        <BiShow className="text-xl text-[#6F7995]" />
      )}
    </button>
  );
}

export default ShowPassword;
