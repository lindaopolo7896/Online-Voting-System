import { useState } from "react";
import { GoDotFill } from "react-icons/go";

import CandidateSection from "../../components/voter/CandidateSection";
import CountDownCard from "../../components/common/CountDownCard";
import useCountdown from "../../hooks/useCountdown";

const election = {
  id: 1,
  title: "2026 STUDENT COUNCIL ELECTIONS",
  status: "live",
  startTime: "2026-06-08T08:00:00",
  endTime: "2026-12-31T23:59:59",
};

const candidates = {
  president: [
    {
      id: 1,
      name: "Ted Owalo",
      position: "President",
      slogan: "Leadership with vision and action",
      bio: "A third-year Computer Science student passionate about student welfare, transparency, and building stronger connections between students and administration.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },

    {
      id: 2,
      name: "Elsie May",
      position: "President",
      slogan: "Together we rise, together we lead",
      bio: "An active student leader with experience organizing campus events and advocating for inclusive opportunities for all students.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },

    {
      id: 3,
      name: "Jane Doe",
      position: "President",
      slogan: "Your voice. Your future. Your leader.",
      bio: "Dedicated to improving student representation and ensuring every student has a voice in decisions that affect campus life.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
  ],

  vicePresident: [
    {
      id: 4,
      name: "Brian Kimani",
      position: "Vice President",
      slogan: "Building stronger student connections",
      bio: "A second-year Business student focused on creating stronger collaboration between student organizations and leadership.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },

    {
      id: 5,
      name: "Sarah Mike",
      position: "Vice President",
      slogan: "Driven by students, powered by change",
      bio: "Passionate about student engagement and ensuring student concerns are addressed quickly and effectively.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    },

    {
      id: 6,
      name: "Kevin Otieno",
      position: "Vice President",
      slogan: "Progress through unity and innovation",
      bio: "A technology enthusiast committed to modernizing student services and promoting innovation across campus.",
      image: "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    },
  ],

  secretary: [
    {
      id: 7,
      name: "Mercy Atieno",
      position: "Secretary",
      slogan: "Clear communication, better leadership",
      bio: "Experienced in student administration and committed to maintaining transparency and effective communication.",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    },

    {
      id: 8,
      name: "Ian Kariuki",
      position: "Secretary",
      slogan: "Organized minds create stronger systems",
      bio: "Focused on improving record management and ensuring students stay informed about important developments.",
      image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3",
    },

    {
      id: 9,
      name: "Daisy Njeri",
      position: "Secretary",
      slogan: "Efficiency, transparency, accountability",
      bio: "Dedicated to creating efficient systems that make student leadership more accessible and accountable.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    },
  ],
};

const positions = [
  {
    key: "president",
    title: "Presidential Candidates",
    candidates: candidates.president,
  },
  {
    key: "vicePresident",
    title: "Vice Presidential Candidates",
    candidates: candidates.vicePresident,
  },
  {
    key: "secretary",
    title: "Secretary Candidates",
    candidates: candidates.secretary,
  },
];
function VotePage() {
  const [votes, setVotes] = useState({
    president: null,
    vicePresident: null,
    secretary: null,
  });

  const countdown = useCountdown(election);

  const handleSubmitVote = () => {
    console.log(votes);
  };

  const summaryPositions = [
    {
      title: "President",
      candidate: votes.president,
    },
    {
      title: "Vice President",
      candidate: votes.vicePresident,
    },
    {
      title: "Secretary",
      candidate: votes.secretary,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] w-full px-2 md:px-10 py-4">
      <div className="p-2 md:p-8 flex flex-col gap-14 w-full">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <div
              className="
            text-[#144DEF]
            font-bold
            border border-[#144DEF]
            flex py-1 px-4
            rounded-full
            w-fit
            bg-white/10
            backdrop-blur-sm
          "
            >
              <p className="flex items-center justify-center gap-2 text-sm">
                <GoDotFill className="animate-pulse" />
                LIVE NOW
              </p>
            </div>

            <h1 className="text-[#144DEF] font-bold text-3xl md:text-4xl">
              {election.title}
            </h1>
          </div>

          <CountDownCard countdown={countdown} />
        </div>

        {positions.map((position) => (
          <CandidateSection
            key={position.key}
            title={position.title}
            candidates={position.candidates}
            selectedCandidate={votes[position.key]}
            setSelectedCandidate={(candidate) =>
              setVotes((prev) => ({
                ...prev,
                [position.key]: candidate,
              }))
            }
          />
        ))}

        <div className="border border-[#144DEF] shadow-xl shadow-[#144DEF]/20 rounded-3xl p-8 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-white">Selected Candidates</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryPositions.map((position) => (
              <div
                key={position.title}
                className="bg-[#0F1117]/70 border border-white/10 rounded-2xl p-4 shadow-md"
              >
                <p className="text-[#144DEF] font-semibold text-sm mb-3">
                  {position.title}
                </p>

                {position.candidate ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={position.candidate.image}
                      alt={position.candidate.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>
                      <h1 className="text-lg text-white">
                        {position.candidate.name}
                      </h1>

                      <p className="text-sm text-gray-500">
                        {position.candidate.slogan}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No candidate selected</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmitVote}
            className="bg-[#144DEF] hover:bg-[#0F1117] text-white px-16 py-4 rounded-full text-xl font-semibold transition-all duration-300"
          >
            Submit Vote
          </button>
        </div>
      </div>
    </div>
  );
}

export default VotePage;
