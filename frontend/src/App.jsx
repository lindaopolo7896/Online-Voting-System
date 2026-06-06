import { Routes, Route } from "react-router-dom";
import SignUpForm from "./auth/SignUpForm";
import LandingPage from "./pages/LandingPage";
import SignInForm from "./auth/SignInForm";
import ForgotPasword from "./auth/ForgotPasword";
import VerifyEmail from "./auth/VerifyEmail";
import ResetPassword from "./auth/ResetPassword";
import Confirmation from "./auth/Confirmation";
import Dashboard from "./pages/Voter/Dashboard";
import VoterLayout from "./layouts/VoterLayout";
import VotePage from "./pages/Voter/VotePage";
import GuidelinesPage from "./pages/Voter/GuidelinesPage";
import ResultsPage from "./pages/Voter/ResultsPage";
import ElectionDetails from "./components/voter/dashboard/ElectionDetails";
import VotingAccess from "./components/vote/VotingAccess";

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/sign-up" element={<SignUpForm />} />

      <Route path="/sign-in" element={<SignInForm />} />
      <Route path="/forgot-password" element={<ForgotPasword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirmation" element={<Confirmation />} />

      {/* Voting  */}
      <Route path="/vote" element={<VotePage />} />
      <Route path="/voting-access" element={<VotingAccess />} />

      <Route path="/voter" element={<VoterLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="/voter/guidelines" element={<GuidelinesPage />} />
        <Route path="/voter/results" element={<ResultsPage />} />
        <Route path="/voter/results/:id" element={<ElectionDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
