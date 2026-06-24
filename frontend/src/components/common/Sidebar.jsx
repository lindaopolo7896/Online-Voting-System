import { RiDashboardFill } from "react-icons/ri";
import { MdHowToVote } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const electionManagerLinks = [
  {
    label: "Dashboard",
    path: "/organisation/dashboard",
    icon: RiDashboardFill,
  },
  {
    label: "Elections",
    path: "/organisation/elections",
    icon: MdHowToVote,
  },
  {
    label: "Candidates",
    path: "/organisation/candidates",
    icon: FaUserAlt,
  },
  {
    label: "Voters",
    path: "/organisation/voters",
    icon: FaUsers,
  },
  {
    label: "Results",
    path: "/organisation/results",
    icon: FaClipboardList,
  },
  {
    label: "Settings",
    path: "/organisation/settings",
    icon: IoMdSettings,
  },
];

const voterLinks = [
  {
    label: "Dashboard",
    path: "/voter/dashboard",
    icon: RiDashboardFill,
  },
  {
    label: "Results",
    path: "/voter/results",
    icon: FaClipboardList,
  },
  {
    label: "Settings",
    path: "/voter/settings",
    icon: IoMdSettings,
  },
];

function Sidebar() {
  const { user } = useAuth();

  const links = user?.role === "admin" ? electionManagerLinks : voterLinks;

  return (
    <nav className="w-72 h-screen bg-surface shadow flex flex-col justify-between sticky top-0 p-6">
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
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

      <button className="bg-error text-white p-3 rounded-lg text-lg font-medium">
        Log out
      </button>
    </nav>
  );
}

export default Sidebar;
