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
import DashboardLayout from "../layouts/DashboardLayout";
import VoterDashboard from "../pages/Voter/VoterDashboard";
import ResultsPage from "../pages/Voter/ResultsPage";
import ResultPage from "../pages/Voter/ResultPage";
import InstitutionDashboardPage from "../pages/institution/InstitutionDashboardPage";
import InstitutionElectionsPage from "../pages/institution/InstitutionElectionsPage";
import InstitutionCandidatesPage from "../pages/institution/InstitutionCandidatesPage";
import InstitutionVotersPage from "../pages/institution/InstitutionVotersPage";
import CreateElectionPage from "../pages/institution/CreateElectionPage";
import ComingSoon from "../pages/ComingSoon";

function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/" element={<ComingSoon />} />

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

      {/* Dashboard Layout  */}
      <Route element={<DashboardLayout />}>
        {/* Voter  */}
        <Route path="/voter/dashboard" element={<VoterDashboard />} />
        <Route path="/voter/results" element={<ResultsPage />} />
        <Route path="/voter/results/:id" element={<ResultPage />} />

        {/* Institution */}
        <Route
          path="/institution/dashboard"
          element={<InstitutionDashboardPage />}
        />
        <Route
          path="/institution/elections"
          element={<InstitutionElectionsPage />}
        />
        <Route
          path="/institution/elections/create"
          element={<CreateElectionPage />}
        />
        <Route
          path="/institution/candidates"
          element={<InstitutionCandidatesPage />}
        />
        <Route path="/institution/voters" element={<InstitutionVotersPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
