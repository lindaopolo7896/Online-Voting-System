import TopBar from "../../components/voter/TopBar";
import {
  FaUserCheck,
  FaLock,
  FaVoteYea,
  FaUserShield,
  FaShieldAlt,
  FaClock,
  FaWifi,
  FaHeadset,
} from "react-icons/fa";

const guidelines = [
  {
    id: 1,
    title: "Eligibility",
    description:
      "Only registered users are allowed to vote. Each voter is entitled to one vote per election.",
    icon: <FaUserCheck />,
    color: "text-[#144DEF]",
    bg: "bg-[#E8F0FF]",
  },

  {
    id: 2,
    title: "Authentication",
    description:
      "Voters must log in using their verified credentials before accessing the voting portal.",
    icon: <FaLock />,
    color: "text-[#34C38F]",
    bg: "bg-[#E9FBF4]",
  },

  {
    id: 3,
    title: "Voting Process",
    description:
      "Carefully review all candidates before casting your vote. Submitted votes cannot be changed.",
    icon: <FaVoteYea />,
    color: "text-[#F59E0B]",
    bg: "bg-[#FFF4E5]",
  },

  {
    id: 4,
    title: "Privacy & Anonymity",
    description:
      "All votes are confidential and anonymous. No administrator can trace votes back to voters.",
    icon: <FaUserShield />,
    color: "text-[#8B5CF6]",
    bg: "bg-[#F3E8FF]",
  },

  {
    id: 5,
    title: "Integrity of Election",
    description:
      "Any attempt to manipulate or interfere with voting will result in immediate disqualification.",
    icon: <FaShieldAlt />,
    color: "text-[#EF4444]",
    bg: "bg-[#FEECEC]",
  },

  {
    id: 6,
    title: "Time Restrictions",
    description:
      "Voting is only allowed during the official election period. Late submissions are not accepted.",
    icon: <FaClock />,
    color: "text-[#2563EB]",
    bg: "bg-[#EAF1FF]",
  },

  {
    id: 7,
    title: "Technical Responsibility",
    description:
      "Ensure you have a stable internet connection before voting. Avoid refreshing the page while voting.",
    icon: <FaWifi />,
    color: "text-[#10B981]",
    bg: "bg-[#E7F9F2]",
  },

  {
    id: 8,
    title: "Support",
    description:
      "If you encounter any issues, contact support before the election closes.",
    icon: <FaHeadset />,
    color: "text-[#F59E0B]",
    bg: "bg-[#FFF4E5]",
  },
];

function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]  w-full">
      <TopBar page="Voter Guidelines" />

      <div className=" p-2 md:p-8 mt-20">
        <div className="bg-white rounded-3xl shadow-lg p-10 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#E8F0FF] flex items-center justify-center">
              <FaShieldAlt className="text-[#144DEF] text-4xl" />
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F1117]">
                Voter Guidelines
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Please read the following guidelines carefully before
                participating in any elections.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            {guidelines.map((guideline) => (
              <div
                key={guideline.id}
                className="flex flex-col md:flex-row items-center md:items-start gap-6 py-6 border-b border-gray-200"
              >
                <div
                  className={`min-w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${guideline.bg} ${guideline.color}`}
                >
                  {guideline.icon}
                </div>

                <div className="min-w-10 h-10 rounded-full bg-[#144DEF] text-white font-bold md:flex items-center justify-center hidden ">
                  {guideline.id}
                </div>

                <div className="flex flex-col gap-2 items-center md:items-start">
                  <h1 className="text-2xl font-bold text-[#0F1117]">
                    {guideline.title}
                  </h1>

                  <p className="text-gray-500 leading-relaxed text-center md:text-left">
                    {guideline.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#E8F0FF] rounded-2xl p-6">
            <h1 className="text-[#144DEF] font-bold text-lg">
              Consent & Agreement
            </h1>

            <p className="text-gray-600 mt-2">
              Participation in an election constitutes your full acceptance of
              these guidelines and any rules governing the voting process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidelinesPage;
