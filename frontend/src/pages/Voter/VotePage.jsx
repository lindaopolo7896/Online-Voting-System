import { useState } from "react";
import CandidateSection from "../../components/voter/CandidateSection";
import TopBar from "../../components/voter/TopBar";

const candidates = {
  president: [
    {
      id: 1,
      name: "Ted Owalo",
      position: "President",
      course: "BSc Computer Science",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      id: 2,
      name: "Elsie May",
      position: "President",
      course: "BBIT",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
      id: 3,
      name: "Jane Doe",
      position: "President",
      course: "Software Engineering",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
  ],

  vicePresident: [
    {
      id: 4,
      name: "Brian Kimani",
      position: "Vice President",
      course: "BSc Information Technology",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },
    {
      id: 5,
      name: "Sarah Mike",
      position: "Vice President",
      course: "BCom Finance",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    },
    {
      id: 6,
      name: "Kevin Otieno",
      position: "Vice President",
      course: "BSc Data Science",
      image: "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    },
  ],

  secretary: [
    {
      id: 7,
      name: "Mercy Atieno",
      position: "Secretary",
      course: "BSc Information Systems",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    },
    {
      id: 8,
      name: "Ian Kariuki",
      position: "Secretary",
      course: "Computer Networks",
      image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3",
    },
    {
      id: 9,
      name: "Daisy Njeri",
      position: "Secretary",
      course: "BBIT",
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
    <div className="min-h-screen bg-[#F8FAFC]  w-full">
      <TopBar page="Vote" />

      <div className=" p-2 md:p-8 mt-20 flex flex-col gap-14">
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

        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-[#0F1117]">
            Selected Candidates
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F8FAFC] rounded-2xl p-4 shadow-md">
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
                    <h1 className="font-bold text-lg">
                      {selectedPresident.name}
                    </h1>

                    <p className="text-sm text-gray-500">
                      {selectedPresident.course}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No candidate selected</p>
              )}
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-4 shadow-md">
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
                    <h1 className="font-bold text-lg">
                      {selectedVicePresident.name}
                    </h1>

                    <p className="text-sm text-gray-500">
                      {selectedVicePresident.course}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No candidate selected</p>
              )}
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-4 shadow-md">
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
                    <h1 className="font-bold text-lg">
                      {selectedSecretary.name}
                    </h1>

                    <p className="text-sm text-gray-500">
                      {selectedSecretary.course}
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
