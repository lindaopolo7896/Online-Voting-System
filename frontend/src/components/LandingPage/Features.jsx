import React from "react";
import SecureIcon from "../../assets/SecureIcon.png";
import VoteIcon from "../../assets/VoteIcon.png";
import TrackingIcon from "../../assets/TrackingIcon.png";
import ResultIcon from "../../assets/ResultIcon.png";

const features = [
  {
    id: 1,
    icon: SecureIcon,
    name: "Secure Authentication",
    description:
      "Only authorized voters can access the system using unique links and OTP verification",
  },
  {
    id: 2,
    icon: VoteIcon,
    name: "One Person, One Vote",
    description:
      "Each voter can cast a single vote, enforced through secure token validation.",
  },
  {
    id: 3,
    icon: TrackingIcon,
    name: "Real-Time Monitoring",
    description:
      "Track voter participation and election progress as it happens across the entire election.",
  },
  {
    id: 4,
    icon: ResultIcon,
    name: "Verifiable Results",
    description:
      "Votes are securely recorded and can be audited for transparency and accuracy.",
  },
];

function Features() {
  return (
    <div className="overflow-hidden bg-[#F9FAFB] py-6">
      <div className="flex w-max marquee">
        {[...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2 mx-10 max-w-[350px]"
          >
            <img src={feature.icon} alt={feature.name} className="w-20" />
            <h1 className="text-[#111827] text-xl font-bold text-center">
              {feature.name}
            </h1>
            <p className="text-center text-black/60">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
