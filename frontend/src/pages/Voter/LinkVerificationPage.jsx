import MailIcon from "../../assets/icons/mail.png";
import maskEmail from "../../helpers/maskEmail";
import Button from "../../components/ui/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { IoMailOutline } from "react-icons/io5";

function LinkVerificationPage({ email = "opololinda@gmail.com" }) {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-8 max-w-lg items-center justify-center">
        <img src={MailIcon} alt="mail icon" className="w-25 h-25" />
        <h1 className="text-text text-3xl font-bold text-center">
          A verification code has been sent to your registered email
        </h1>
        <p className="text-muted ">
          Please check your email and enter the code to continue voting
        </p>
        <div className="flex items-center gap-8 border-border border w-full py-2 px-4 rounded-lg">
          <IoMailOutline className="text-muted text-xl" />
          <div className="flex flex-col gap-2">
            <p className="text-text">{maskEmail(email)}</p>
            <p className="text-muted">
              Can't access this email?
              <a
                href={`mailto:${email}?subject=Support Request`}
                className="text-primary hover:underline hover:tet-primary/90 transition-all duration-300 ease-in-out"
              >
                Contact election admin
              </a>
            </p>
          </div>
        </div>
        <Button name={"Continue"} />
        <p className="text-muted text-center">
          For your security this link is unique to you and should not be shared
          with anyone
        </p>
      </div>
    </AuthLayout>
  );
}

export default LinkVerificationPage;
