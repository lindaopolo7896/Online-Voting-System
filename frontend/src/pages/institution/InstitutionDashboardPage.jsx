import { useEffect } from "react";
import useDashboard from "../../hooks/useDashboard";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import ProgressCard from "../../components/voter/results/ProgressCard";
import ProfileImg from "../../components/ui/ProfileImg";
import Divider from "../../components/ui/Divider";
import { IoMdAdd } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import VoterTurnoutChart from "../../components/common/VoterTurnoutChart";
import CandidatesByPositionChart from "../../components/common/CandidatesByPositionChart";

const dashboardStats = [
  {
    title: "Active Elections",
    value: 3,
    link: "/institution/elections",
    sub: "View all elections",
  },

  {
    title: "Total Candidates",
    value: 24,
    link: "/institution/candidates",
    sub: "View all candidates",
  },

  {
    title: "Total Voters",
    value: 1259,
    link: "/institution/voters",
    sub: "View all voters",
  },

  {
    title: "Votes Cast",
    value: 987,
    link: "/institution/results",
    sub: "View all results",
  },
];

const actions = [
  {
    icon: IoMdAdd,
    actionName: "Create new election",
    link: "/institutions/elections/create-election",
  },
  {
    icon: IoPersonAdd,
    actionName: "Add Candidates",
    link: "/institutions/elections/add-candidate",
  },
  {
    icon: IoCloudUploadOutline,
    actionName: "Upload Voters",
    link: "/institutions/elections/upload-voters",
  },
  {
    icon: LuClipboardList,
    actionName: "View Results",
    link: "/institutions/results",
  },
];

function InstitutionDashboardPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Welcome Back");
    setSubtitle("Here is what is happening with your eectionss");
  }, [setPageTitle, setSubtitle]);

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Dashboard Stats  */}
      <div className="flex gap-4 ">
        {dashboardStats.map((stat) => (
          <Card
            index
            className="border-white/10 flex-1 flex flex-col gap-2 p-2 rounded-lg"
          >
            <h1 className="font-medium text-muted">{stat.title}</h1>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <Link
              to={stat.link}
              className="flex items-center text-sm gap-3 text-primary hover:underline underline-offset-2 w-fit"
            >
              {stat.sub}
              <FaArrowRightLong />
            </Link>
          </Card>
        ))}
      </div>

      {/* section 2  */}
      <div className="flex gap-8">
        {/* live election card  */}
        <Card className="border-white/10 rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <h1 className="text-text text-lg font-bold">
              Current Live Election
            </h1>
          </div>

          <div className="flex gap-4">
            <ProfileImg className="w-20 h-20 p-2" />

            <div className="flex flex-col gap-2">
              <h1 className="text-primary font-medium">
                2026 Student Council Elections
              </h1>
              <div className="flex gap-5">
                <div>
                  <h4 className="text-muted">Start Date</h4>
                  <p className="text-text">May 14, 2026 8:00 AM</p>
                </div>
                <Divider />
                <div>
                  <h4 className="text-muted">End Date</h4>
                  <p className="text-text">May 14, 2026 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <ProgressCard title="Voter Turnout" current={344} total={374} />

          <Link
            to={"/"}
            className="flex items-center gap-2 text-primary bg-primary/12 w-fit border border-primary rounded px-3 py-1 hover:underline underline-offset-2"
          >
            View election details <FaArrowRightLong />
          </Link>
        </Card>

        {/* quick actions  */}
        <Card className="border-white/10 rounded-2xl flex flex-col justify-between p-5">
          <h1 className="font-bold text-lg text-text">Quick Actions</h1>
          {actions.map((action) => (
            <Link
              index
              to={action.link}
              className="hover:scale-102 hover:shadow-primary/12 hover:shadow rounded-lg transition-all duration-300 ease-in-out"
            >
              <Card className="border-white/10 flex items-center rounded-xl p-3 justify-between">
                <div className="flex items-center justify-center gap-6 ">
                  <div className="h-8 w-8 bg-primary flex items-center justify-center rounded">
                    <action.icon className="text-white text-lg" />
                  </div>
                  <p className="text-lg text-text">{action.actionName}</p>
                </div>
                <FaArrowRightLong className="mr-10 text-muted text-lg" />
              </Card>
            </Link>
          ))}
        </Card>
      </div>

      {/* section 3  */}
      <div className="flex gap-8">
        <VoterTurnoutChart />
        <CandidatesByPositionChart />
      </div>
    </div>
  );
}

export default InstitutionDashboardPage;
