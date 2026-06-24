import { RiDashboardFill } from "react-icons/ri";
import { MdHowToVote, MdSecurity } from "react-icons/md";
import { FaClipboardList, FaUserAlt, FaUsers, FaBuilding } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const electionManagerLinks = [
  { label: "Dashboard", path: "/organisation/dashboard", icon: RiDashboardFill },
  { label: "Elections", path: "/organisation/elections", icon: MdHowToVote },
  { label: "Candidates", path: "/organisation/candidates", icon: FaUserAlt },
  { label: "Voters", path: "/organisation/voters", icon: FaUsers },
  { label: "Results", path: "/organisation/results", icon: FaClipboardList },
  { label: "Permissions", path: "/organisation/permissions", icon: MdSecurity },
  { label: "Settings", path: "/organisation/settings", icon: IoMdSettings },
];

const voterLinks = [
  { label: "Dashboard", path: "/voter/dashboard", icon: RiDashboardFill },
  { label: "Results", path: "/voter/results", icon: FaClipboardList },
  { label: "My Organisations", path: "/voter/organisations", icon: FaBuilding },
  { label: "Settings", path: "/voter/settings", icon: IoMdSettings },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const links = user?.role === "admin" ? electionManagerLinks : voterLinks;

  return (
    <nav
      className={[
        // base
        "fixed inset-y-0 left-0 z-40 w-72 bg-surface shadow-xl",
        "flex flex-col justify-between p-6 transition-transform duration-300",
        // mobile: slide in/out
        isOpen ? "translate-x-0" : "-translate-x-full",
        // desktop: always visible, part of normal flow
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow",
      ].join(" ")}
    >
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-1.5 rounded-lg text-muted hover:text-text hover:bg-background transition lg:hidden"
        aria-label="Close menu"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-2 mt-8 lg:mt-0">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-white"
                  : "text-text hover:bg-background"
              }`
            }
          >
            <link.icon />
            {link.label}
          </NavLink>
        ))}
      </div>

      <button
        onClick={logout}
        className="bg-error text-white p-3 rounded-lg text-lg font-medium"
      >
        Log out
      </button>
    </nav>
  );
}

export default Sidebar;
