import ElectionCard from "../../components/voter/ElectionCard";
import LiveResults from "../../components/voter/LiveResults";
import TopBar from "../../components/voter/TopBar";
import VotingProcess from "../../components/voter/VotingProcess";
const election = {
  id: 1,
  title: "Student Council Election",

  isActive: true,

  registeredVoters: 374,
  votesCast: 344,
  turnoutRate: 90,

  countdown: {
    hours: 4,
    minutes: 32,
    seconds: 15,
  },

  categories: [
    {
      id: 1,
      position: "President",
      results: [
        {
          candidate: "Ted Owalo",
          votes: 117,
          percentage: 39,
        },
        {
          candidate: "Elsie May",
          votes: 104,
          percentage: 35,
        },
        {
          candidate: "Jane Doe",
          votes: 74,
          percentage: 26,
        },
      ],
    },

    {
      id: 2,
      position: "Vice President",
      results: [
        {
          candidate: "Brian Kimani",
          votes: 132,
          percentage: 44,
        },
        {
          candidate: "Sarah Mike",
          votes: 98,
          percentage: 33,
        },
        {
          candidate: "Kevin Otieno",
          votes: 70,
          percentage: 23,
        },
      ],
    },

    {
      id: 3,
      position: "Secretary",
      results: [
        {
          candidate: "Mercy Atieno",
          votes: 145,
          percentage: 48,
        },
        {
          candidate: "Ian Kariuki",
          votes: 96,
          percentage: 32,
        },
        {
          candidate: "Daisy Njeri",
          votes: 59,
          percentage: 20,
        },
      ],
    },
  ],

  schedule: [
    {
      event: "Voting Opens",
      time: "8:00 AM",
    },
    {
      event: "Voting Closes",
      time: "6:00 PM",
    },
    {
      event: "Results Announcement",
      time: "7:30 PM",
    },
  ],
};

function Dashboard() {
  return (
    <div className="w-full ">
      <TopBar page="Dashboard" />
      <div className="flex flex-col md:flex-row mt-20">
        <div className="p-6 md:w-3/4 flex flex-col gap-10">
          <ElectionCard {...election} />
          <LiveResults election={election} />
        </div>
        <div className="lg:w-1/4 py-8 px-4  shadow-xl  min-h-screen">
          <VotingProcess {...election} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
