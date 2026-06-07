import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SignInForm from "../pages/auth/SignInForm";
import SignUpForm from "../pages/auth/SignUpForm";
import ForgotPasword from "../pages/auth/ForgotPasword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import Confirmation from "../pages/auth/Confirmation";
import LinkVerificationPage from "../pages/Voter/LinkVerificationPage";
import VotingInstructions from "../pages/Voter/VotingInstructions";
import VotePage from "../pages/Voter/VotePage";
import VotingAccess from "../components/vote/VotingAccess";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* auth pages  */}
      <Route path="/sign-in" element={<SignInForm />} />
      <Route path="/sign-up" element={<SignUpForm />} />
      <Route path="/forgot-password" element={<ForgotPasword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/voter-verification" element={<LinkVerificationPage />} />

      {/* voter pages  */}

      <Route path="/voting-details" element={<VotingAccess />} />
      <Route path="/voting-instructions" element={<VotingInstructions />} />
      <Route path="/vote" element={<VotePage />} />
    </Routes>
  );
}

export default AppRoutes;
