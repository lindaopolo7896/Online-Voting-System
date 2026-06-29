import { Routes, Route } from "react-router-dom";

// Auth pages
import SignInForm from "@/pages/auth/SignInForm";
import SignUpForm from "@/pages/auth/SignUpForm";
import ForgotPasword from "@/pages/auth/ForgotPasword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ResetPassword from "@/pages/auth/ResetPassword";
import Confirmation from "@/pages/auth/Confirmation";

// Voting flow (token + verified-session based, self-guarded — not a dashboard login)
import LinkVerificationPage from "@/pages/voter/LinkVerificationPage";
import VoterLinkVerifyPage from "@/pages/voter/VoterLinkVerifyPage";
import VotingInstructions from "@/pages/voter/VotingInstructions";
import VotePage from "@/pages/voter/VotePage";
import VoteConfirmationPage from "@/pages/voter/VoteConfirmationPage";
import VotingAccess from "@/features/voting/components/VotingAccess";

// Layouts
import DashboardLayout from "@/components/layout/DashboardLayout";

// Route guards
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import AdminRoute from "@/app/routes/AdminRoute";
import GuestRoute from "@/app/routes/GuestRoute";

// Voter pages
import VoterDashboard from "@/pages/voter/VoterDashboard";
import ResultsPage from "@/pages/voter/ResultsPage";
import ResultPage from "@/pages/voter/ResultPage";
import VoterSettingsPage from "@/pages/voter/VoterSettingsPage";
import VoterCandidacyPage from "@/pages/voter/VoterCandidacyPage";

// Organisation pages
import OrganisationDashboardPage from "@/pages/organisation/OrganisationDashboardPage";
import OrganisationElectionsPage from "@/pages/organisation/OrganisationElectionsPage";
import OrganisationCandidatesPage from "@/pages/organisation/OrganisationCandidatesPage";
import OrganisationMembersPage from "@/pages/organisation/OrganisationMembersPage";
import OrganisationVotersPage from "@/pages/organisation/OrganisationVotersPage";
import OrganisationPermissionsPage from "@/pages/organisation/OrganisationPermissionsPage";
import OrganisationResultsPage from "@/pages/organisation/OrganisationResultsPage";
import OrganisationAnalyticsPage from "@/pages/organisation/OrganisationAnalyticsPage";
import OrganisationSettingsPage from "@/pages/organisation/OrganisationSettingsPage";
import CreateElectionPage from "@/pages/organisation/CreateElectionPage";

import LandingPage from "@/pages/LandingPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Voting flow (public entry) — the unique link + OTP verify the voter for a
          specific election. These pages self-guard on the verified voting session
          (sessionStorage); they are NOT a dashboard login. */}
      <Route path="/voter-verification" element={<LinkVerificationPage />} />
      <Route path="/voter-verification/code" element={<VoterLinkVerifyPage />} />
      <Route path="/voting-details" element={<VotingAccess />} />
      <Route path="/voting-instructions" element={<VotingInstructions />} />
      <Route path="/vote" element={<VotePage />} />
      <Route path="/vote-confirmation" element={<VoteConfirmationPage />} />

      {/* Guest-only: redirect logged-in users to their dashboard */}
      <Route element={<GuestRoute />}>
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Route>

      {/* Dashboard layout — voter routes (any authenticated user) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/voter/dashboard" element={<VoterDashboard />} />
          <Route path="/voter/results" element={<ResultsPage />} />
          <Route path="/voter/results/:id" element={<ResultPage />} />
          <Route path="/voter/candidacy" element={<VoterCandidacyPage />} />
          <Route path="/voter/settings" element={<VoterSettingsPage />} />
        </Route>
      </Route>

      {/* Dashboard layout — admin-only organisation routes */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/organisation/dashboard"
            element={<OrganisationDashboardPage />}
          />
          <Route
            path="/organisation/elections"
            element={<OrganisationElectionsPage />}
          />
          <Route
            path="/organisation/create-election"
            element={<CreateElectionPage />}
          />
          <Route
            path="/organisation/candidates"
            element={<OrganisationCandidatesPage />}
          />
          <Route
            path="/organisation/members"
            element={<OrganisationMembersPage />}
          />
          <Route
            path="/organisation/voters"
            element={<OrganisationVotersPage />}
          />
          <Route
            path="/organisation/permissions"
            element={<OrganisationPermissionsPage />}
          />
          <Route
            path="/organisation/results"
            element={<OrganisationResultsPage />}
          />
          <Route
            path="/organisation/analytics"
            element={<OrganisationAnalyticsPage />}
          />
          <Route
            path="/organisation/settings"
            element={<OrganisationSettingsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
