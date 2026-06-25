import { Routes, Route } from "react-router-dom";

// Auth pages
import SignInForm from "../pages/auth/SignInForm";
import SignUpForm from "../pages/auth/SignUpForm";
import ForgotPasword from "../pages/auth/ForgotPasword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import Confirmation from "../pages/auth/Confirmation";

// Voting flow (token-based, requires auth)
import LinkVerificationPage from "../pages/Voter/LinkVerificationPage";
import VotingInstructions from "../pages/Voter/VotingInstructions";
import VotePage from "../pages/Voter/VotePage";
import VotingAccess from "../components/vote/VotingAccess";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

// Route guards
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";
import GuestRoute from "../components/auth/GuestRoute";

// Voter pages
import VoterDashboard from "../pages/Voter/VoterDashboard";
import ResultsPage from "../pages/Voter/ResultsPage";
import ResultPage from "../pages/Voter/ResultPage";
import VoterOrganisationsPage from "../pages/Voter/VoterOrganisationsPage";
import VoterSettingsPage from "../pages/Voter/VoterSettingsPage";

// Organisation pages
import OrganisationDashboardPage from "../pages/organisation/OrganisationDashboardPage";
import OrganisationElectionsPage from "../pages/organisation/OrganisationElectionsPage";
import OrganisationCandidatesPage from "../pages/organisation/OrganisationCandidatesPage";
import OrganisationMembersPage from "../pages/organisation/OrganisationMembersPage";
import OrganisationPermissionsPage from "../pages/organisation/OrganisationPermissionsPage";
import OrganisationResultsPage from "../pages/organisation/OrganisationResultsPage";
import OrganisationAnalyticsPage from "../pages/organisation/OrganisationAnalyticsPage";
import OrganisationSettingsPage from "../pages/organisation/OrganisationSettingsPage";
import CreateElectionPage from "../pages/organisation/CreateElectionPage";

import ComingSoon from "../pages/ComingSoon";

function AppRoutes() {
  return (
    <Routes>
      {/* Public landing */}
      <Route path="/" element={<ComingSoon />} />

      {/* Guest-only: redirect logged-in users to their dashboard */}
      <Route element={<GuestRoute />}>
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Route>

      {/* Voting flow — requires authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/voter-verification" element={<LinkVerificationPage />} />
        <Route path="/voting-details" element={<VotingAccess />} />
        <Route path="/voting-instructions" element={<VotingInstructions />} />
        <Route path="/vote" element={<VotePage />} />
      </Route>

      {/* Dashboard layout — voter routes (any authenticated user) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/voter/dashboard" element={<VoterDashboard />} />
          <Route path="/voter/results" element={<ResultsPage />} />
          <Route path="/voter/results/:id" element={<ResultPage />} />
          <Route
            path="/voter/organisations"
            element={<VoterOrganisationsPage />}
          />
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
