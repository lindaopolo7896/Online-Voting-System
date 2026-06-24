import AuthLayout from "../../layouts/AuthLayout";
import { TiTick } from "react-icons/ti";
import { MdLockOutline } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import { MdOutlineVerifiedUser } from "react-icons/md";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

const instructions = [
  {
    id: 1,
    icon: MdLockOutline,
    title: "Your vote is confidential",
    description: "Your identity and vote will remain completely private",
  },
  {
    id: 2,
    icon: FaLink,
    title: "This link is unique to you",
    description: "Do not share your voting link with anyone",
  },
  {
    id: 3,
    icon: FaWifi,
    title: "Vote in one sitting",
    description:
      "Once you start, complete the voting without closing or refreshing the page",
  },
  {
    id: 4,
    icon: GoVerified,
    title: "One vote per voter",
    description: "You can submit your vote only once",
  },
  {
    id: 5,
    icon: MdOutlineVerifiedUser,
    title: "Secure & Tamper-proof",
    description: "Our system ensures a fair and transparent election",
  },
];

function VotingInstructions() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-5 items-center justify-center max-w-lg">
        <div className="flex flex-col items-center justify-center bg-success h-15 w-15 rounded-full">
          <TiTick className="text-white text-[40px]" />
        </div>
        <h1 className="text-3xl text-text font-bold">You're all set!</h1>
        <p className="text-muted text-lg tet-center">
          Please read the instructions carefully before you begin voting
        </p>

        <Card className={"p-5 rounded-lg gap-4 flex flex-col"}>
          {instructions.map((instruction) => {
            const Icon = instruction.icon;

            return (
              <div
                className="flex items-center gap-4 border-b border-border py-2"
                key={instruction.id}
              >
                <Icon className="text-primary text-2xl" />

                <div>
                  <h1 className="font-bold text-text">{instruction.title}</h1>

                  <p className="text-muted text-sm">
                    {instruction.description}
                  </p>
                </div>
              </div>
            );
          })}
        </Card>
        <Link to="/vote" className="w-full">
          <Button name={"Continue"} />
        </Link>
      </div>
    </AuthLayout>
  );
}

export default VotingInstructions;
