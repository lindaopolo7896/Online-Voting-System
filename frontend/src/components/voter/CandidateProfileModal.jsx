import { IoClose } from "react-icons/io5";

function CandidateProfileModal({ candidate, onClose, onSelect }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">Candidate Profile</h1>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl"
          >
            <IoClose />
          </button>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Left */}
          <div className="flex flex-col items-center gap-5">
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-full max-w-md h-[320px] object-cover rounded-2xl"
            />

            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary">
                {candidate.name}
              </h1>

              <p className="text-muted mt-2">{candidate.position}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1"></div>

              <span className="text-primary font-semibold">SLOGAN</span>

              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <h1 className="text-4xl font-bold text-text text-center">
              "{candidate.slogan}"
            </h1>

            <div className="h-px bg-white/10"></div>

            <div>
              <h2 className="text-primary font-bold text-xl mb-3"></h2>

              <p className="text-gray-400 leading-8">{candidate.bio}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-primary text-primary py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            Close
          </button>

          <button
            onClick={() => onSelect(candidate)}
            className="flex-1 bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all"
          >
            Select Candidate
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfileModal;
