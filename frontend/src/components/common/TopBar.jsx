import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Menu } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import ProfileImg from "../ui/ProfileImg";
import useDashboard from "../../hooks/useDashboard";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { MdComputer } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import OrgSwitcher from "./OrgSwitcher";

function TopBar({ onMenuClick }) {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();
  const { pageTitle, subTitle } = useDashboard();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 sm:h-20 px-4 sm:px-6 shadow flex items-center justify-between sticky top-0 z-20 bg-surface/95 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Hamburger — only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-text hover:bg-background transition lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg sm:text-2xl font-bold text-text leading-tight">
            {pageTitle}
          </h1>
          {subTitle && (
            <p className="text-xs sm:text-sm text-muted hidden sm:block">
              {subTitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === "admin" && <OrgSwitcher />}

        <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          <ProfileImg />

          <div className="text-left hidden sm:block">
            <p className="font-semibold text-text">{user?.name}</p>

            <p className="text-sm text-muted capitalize">
              {user?.role?.replace("-", " ")}
            </p>
          </div>

          <IoChevronDown
            className={`transition-transform duration-300 text-text ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-14 w-60 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50">
            <button className="w-full text-left px-4 py-3 hover:bg-background transition">
              Profile
            </button>

            <div className="border-t border-border">
              <p className="px-4 py-2 text-xs font-semibold text-muted uppercase">
                Appearance
              </p>

              <button
                onClick={() => setTheme("system")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition"
              >
                <div className="flex items-center gap-3">
                  <MdComputer />
                  <span>System</span>
                </div>

                {theme === "system" && <FaCheck className="text-primary" />}
              </button>

              <button
                onClick={() => setTheme("light")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition"
              >
                <div className="flex items-center gap-3">
                  <MdLightMode />
                  <span>Light</span>
                </div>

                {theme === "light" && <FaCheck className="text-primary" />}
              </button>

              <button
                onClick={() => setTheme("dark")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition"
              >
                <div className="flex items-center gap-3">
                  <MdDarkMode />
                  <span>Dark</span>
                </div>

                {theme === "dark" && <FaCheck className="text-primary" />}
              </button>
            </div>

            <div className="border-t border-border">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 hover:bg-background transition text-error"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
