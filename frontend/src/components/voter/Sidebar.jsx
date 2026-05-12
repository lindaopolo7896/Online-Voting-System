import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdHowToVote } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { TiClipboard } from "react-icons/ti";
import { BiSupport } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

import { useSidebar } from "../../hooks/useSidebar";

function Sidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 bg-black/40 z-40 lg:hidden transition-all duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      ></div>

      <div
        className={`
          fixed left-0 top-0 z-50
          h-screen w-70 md:w-80 bg-white shadow-2xl
          px-4 py-12

          flex flex-col items-center justify-between

          transition-all duration-300

          lg:translate-x-0

          ${open ? "translate-x-0" : "-translate-x-full"}

          lg:flex
        `}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 lg:hidden"
        >
          <IoClose className="text-3xl text-[#0F1117]" />
        </button>

        <p>Logo</p>

        <div className="flex flex-col gap-5">
          <NavLink
            to="/voter"
            end
            className={({ isActive }) =>
              `px-8 py-2 rounded-lg flex items-center justify-start gap-2 text-lg font-medium ${
                isActive
                  ? "bg-[#144DEF] text-white"
                  : "text-[#0F1117] bg-transparent hover:text-[#144DEF] hover:border hover:border-[#144DEF] transition-all duration-300 ease-in-out"
              }`
            }
          >
            <MdDashboard className="text-[20px]" />
            Dashboard
          </NavLink>

          <NavLink
            to="/voter/vote"
            className={({ isActive }) =>
              `px-8 py-2 rounded-lg flex justify-start items-center gap-2 text-lg font-medium ${
                isActive
                  ? "bg-[#144DEF] text-white"
                  : "text-[#0F1117] hover:text-[#144DEF] hover:border hover:border-[#144DEF] transition-all duration-300 ease-in-out"
              }`
            }
          >
            <MdHowToVote className="text-[20px]" />
            Vote
          </NavLink>

          <NavLink
            to="/voter/guidelines"
            className={({ isActive }) =>
              `px-8 py-2 rounded-lg flex justify-start items-center gap-2 text-lg font-medium ${
                isActive
                  ? "bg-[#144DEF] text-white"
                  : "text-[#0F1117] hover:text-[#144DEF] hover:border hover:border-[#144DEF] transition-all duration-300 ease-in-out"
              }`
            }
          >
            <FaUsers className="text-[20px]" />
            Voter Guidelines
          </NavLink>

          <NavLink
            to="/voter/results"
            className={({ isActive }) =>
              `px-8 py-2 rounded-lg flex justify-start items-center gap-2 text-lg font-medium ${
                isActive
                  ? "bg-[#144DEF] text-white"
                  : "text-[#0F1117] hover:text-[#144DEF] hover:border hover:border-[#144DEF] transition-all duration-300 ease-in-out"
              }`
            }
          >
            <TiClipboard className="text-[20px]" />
            Results
          </NavLink>

          <NavLink
            to="/voter/support"
            className={({ isActive }) =>
              `px-8 py-2 rounded-lg flex justify-start items-center gap-2 text-lg font-medium ${
                isActive
                  ? "bg-[#144DEF] text-white"
                  : "text-[#0F1117] hover:text-[#144DEF] hover:border hover:border-[#144DEF] transition-all duration-300 ease-in-out"
              }`
            }
          >
            <BiSupport className="text-[20px]" />
            Support
          </NavLink>
        </div>

        <button className="bg-[#0F1117] text-white py-2 px-14 rounded-full font-medium hover:border hover:bg-transparent hover:border-[#0F1117] hover:text-[#0F1117] cursor-pointer transition-all duration-300 ease-in-out active:bg-[#0f1117]/95 active:text-white">
          Log Out
        </button>
      </div>
    </>
  );
}

export default Sidebar;
