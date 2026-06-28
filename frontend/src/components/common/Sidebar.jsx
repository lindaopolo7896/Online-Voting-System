import {
  Building2,
  Users,
  KeyRound,
  Settings,
  Vote,
  PlusCircle,
  UserCheck,
  BarChart2,
  TrendingUp,
  FileText,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { RiDashboardFill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import Logo from "../../assets/logo/logo.png";

//  Admin Nav
const adminSections = [
  {
    title: "ORGANISATION",
    items: [
      { label: "Overview", path: "/organisation/dashboard", icon: Building2 },
      { label: "Members", path: "/organisation/members", icon: Users },
      {
        label: "Permissions",
        path: "/organisation/permissions",
        icon: KeyRound,
      },
      { label: "Settings", path: "/organisation/settings", icon: Settings },
    ],
  },
  {
    title: "ELECTIONS",
    items: [
      { label: "All Elections", path: "/organisation/elections", icon: Vote },
      {
        label: "Create Election",
        path: "/organisation/create-election",
        icon: PlusCircle,
      },
      { label: "Candidates", path: "/organisation/candidates", icon: UserCheck },
      { label: "Voters", path: "/organisation/voters", icon: Users },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Results", path: "/organisation/results", icon: BarChart2 },
      { label: "Analytics", path: "/organisation/analytics", icon: TrendingUp },
    ],
  },
  {
    title: "AUDIT LOGS",
    items: [
      { label: "Audit Logs", path: "/organisation/audit-logs", icon: FileText },
    ],
  },
];

//  Voter Nav
const voterSections = [
  {
    items: [
      { label: "Dashboard", path: "/voter/dashboard", icon: RiDashboardFill },
      { label: "Results", path: "/voter/results", icon: FaClipboardList },
      { label: "My Candidacy", path: "/voter/candidacy", icon: UserCheck },
      { label: "Settings", path: "/voter/settings", icon: IoMdSettings },
    ],
  },
];

//  Logo
function VotexLogo() {
  return (
    <div className="flex items-center gap-3 px-2 mb-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary shrink-0">
        <img src={Logo} alt="" />
      </div>
      <span className="text-xl font-bold tracking-widest text-primary">
        VOTEX
      </span>
    </div>
  );
}

// Single nav item
function NavItem({ item, onClose }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive ? "bg-primary text-white" : "text-text hover:bg-background"
        }`
      }
    >
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
}

// Sidebar
function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const sections = user?.role === "admin" ? adminSections : voterSections;

  return (
    <nav
      className={[
        "fixed inset-y-0 left-0 z-40 w-64 bg-surface shadow-xl",
        "flex flex-col p-5 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow",
      ].join(" ")}
    >
      {/* Mobile close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-1.5 rounded-lg text-muted hover:text-text hover:bg-background transition lg:hidden"
        aria-label="Close menu"
      >
        <X size={20} />
      </button>

      <VotexLogo />

      {/* Nav sections — scrollable area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5">
        {sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {section.title && (
              <p className="px-4 mb-1 text-[11px] font-semibold tracking-widest text-muted uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <NavItem
                key={item.path + item.label}
                item={item}
                onClose={onClose}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Log out */}
      <button
        onClick={logout}
        className="mt-4 w-full rounded-xl bg-[#0d0d0d] py-3 text-sm font-semibold text-white hover:bg-black transition"
      >
        Log Out
      </button>
    </nav>
  );
}

export default Sidebar;
