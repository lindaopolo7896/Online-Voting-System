import { Routes, Route } from "react-router-dom";
import SignUpForm from "./auth/SignUpForm";
import LandingPage from "./pages/LandingPage";
import SignInForm from "./auth/SignInForm";
import ForgotPasword from "./auth/ForgotPasword";
import VerifyEmail from "./auth/VerifyEmail";
import ResetPassword from "./auth/ResetPassword";
import Confirmation from "./auth/Confirmation";

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
    </Routes>
  );
}

export default App;
