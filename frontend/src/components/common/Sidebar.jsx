import { RiDashboardFill } from "react-icons/ri";
import { MdHowToVote } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { users } from "../../mock/data";
import { Link } from "react-router-dom";

const electionManagerLinks = [
  {
    label: "Dashboard",
    path: "/institution",
    icon: RiDashboardFill,
  },
  {
    label: "Elections",
    path: "/institution/elections",
    icon: MdHowToVote,
  },
  {
    label: "Candidates",
    path: "/institution/candidates",
    icon: FaUserAlt,
  },
  {
    label: "Voters",
    path: "/institution/voters",
    icon: FaUsers,
  },
  {
    label: "Results",
    path: "/institution/results",
    icon: FaClipboardList,
  },
  {
    label: "Settings",
    path: "/institution/settings",
    icon: IoMdSettings,
  },
];

const voterLinks = [
  {
    label: "Dashboard",
    path: "/voter",
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
  const links =
    users.role === "ELECTION_MANAGER" ? electionManagerLinks : voterLinks;

  return (
    <nav className="fixed w-1/3 top-0 left-0 bg-surface min-h-screen flex-col">
      <div>
        {links.map((link) => (
          <Link to={link.path}>{link.label}</Link>
        ))}
      </div>
      <button>Log out</button>
    </nav>
  );
}

export default Sidebar;
