import { useState } from "react";
import CandidateSection from "../../components/voter/CandidateSection";
import TopBar from "../../components/voter/TopBar";
import { GoDotFill } from "react-icons/go";

const candidates = {
  president: [
    {
      id: 1,
      name: "Ted Owalo",
      position: "President",
      slogan: "Leadership with vision and action",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },

    {
      id: 2,
      name: "Elsie May",
      position: "President",
      slogan: "Together we rise, together we lead",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },

    {
      id: 3,
      name: "Jane Doe",
      position: "President",
      slogan: "Your voice. Your future. Your leader.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
  ],

  vicePresident: [
    {
      id: 4,
      name: "Brian Kimani",
      position: "Vice President",
      slogan: "Building stronger student connections",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },

    {
      id: 5,
      name: "Sarah Mike",
      position: "Vice President",
      slogan: "Driven by students, powered by change",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    },

    {
      id: 6,
      name: "Kevin Otieno",
      position: "Vice President",
      slogan: "Progress through unity and innovation",
      image: "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    },
  ],

  secretary: [
    {
      id: 7,
      name: "Mercy Atieno",
      position: "Secretary",
      slogan: "Clear communication, better leadership",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    },

    {
      id: 8,
      name: "Ian Kariuki",
      position: "Secretary",
      slogan: "Organized minds create stronger systems",
      image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3",
    },

    {
      id: 9,
      name: "Daisy Njeri",
      position: "Secretary",
      slogan: "Efficiency, transparency, accountability",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    },
  ],
};

function VotePage() {
  const [selectedPresident, setSelectedPresident] = useState(null);
  const [selectedVicePresident, setSelectedVicePresident] = useState(null);
  const [selectedSecretary, setSelectedSecretary] = useState(null);

  const handleSubmitVote = () => {
    const votes = {
      president: selectedPresident,
      vicePresident: selectedVicePresident,
      secretary: selectedSecretary,
    };

    console.log(votes);
  };

  return (
    <div className="min-h-screen bg-[#0B0C10]  w-full px-2 md:px-10 py-4">
      <h1></h1>
      <div className=" p-2 md:p-8  flex flex-col gap-14 w-full">
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
            2026 STUDENT COUNCIL ELECTIONS
          </h1>
        </div>
        <CandidateSection
          title="Presidential Candidates"
          candidates={candidates.president}
          selectedCandidate={selectedPresident}
          setSelectedCandidate={setSelectedPresident}
        />

        <CandidateSection
          title="Vice Presidential Candidates"
          candidates={candidates.vicePresident}
          selectedCandidate={selectedVicePresident}
          setSelectedCandidate={setSelectedVicePresident}
        />

        <CandidateSection
          title="Secretary Candidates"
          candidates={candidates.secretary}
          selectedCandidate={selectedSecretary}
          setSelectedCandidate={setSelectedSecretary}
        />

        <div className="border border-[#144DEF] shadow-xl shadow-[#144DEF]/20 rounded-3xl p-8 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-white">Selected Candidates</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0F1117]/70 border border-white/10 rounded-2xl p-4 shadow-md">
              <p className="text-[#144DEF] font-semibold text-sm mb-3">
                President
              </p>

              {selectedPresident ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPresident.image}
                    alt={selectedPresident.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div>
                    <h1 className=" text-lg text-white">
                      {selectedPresident.name}
                    </h1>

                    <p className="text-sm text-gray-500">
                      {selectedPresident.slogan}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No candidate selected</p>
              )}
            </div>

            <div className="bg-[#0F1117]/70 border border-white/10  rounded-2xl p-4 shadow-md">
              <p className="text-[#144DEF] font-semibold text-sm mb-3">
                Vice President
              </p>

              {selectedVicePresident ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedVicePresident.image}
                    alt={selectedVicePresident.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div>
                    <h1 className="text-white text-lg">
                      {selectedVicePresident.name}
                    </h1>

                    <p className="text-sm text-gray-500">
                      {selectedVicePresident.slogan}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No candidate selected</p>
              )}
            </div>

            <div className="bg-[#0F1117]/70 border border-white/10  rounded-2xl p-4 shadow-md">
              <p className="text-[#144DEF] font-semibold text-sm mb-3">
                Secretary
              </p>

              {selectedSecretary ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedSecretary.image}
                    alt={selectedSecretary.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div>
                    <h1 className="text-white text-lg">
                      {selectedSecretary.name}
                    </h1>

                    <p className="text-sm text-gray-500">
                      {selectedSecretary.slogan}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No candidate selected</p>
              )}
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
    </div>
  );
}

export default VotePage;
