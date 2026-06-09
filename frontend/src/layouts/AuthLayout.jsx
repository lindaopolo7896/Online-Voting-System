import Dark from "../assets/images/bg-dark.png";
import Light from "../assets/images/bg-light.png";
import useTheme from "../hooks/useTheme";

function AuthLayout({ children }) {
  const { theme } = useTheme();
  const bgImage = theme === "dark" ? Dark : Light;

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="bg-cover bg-center min-h-screen flex items-center justify-center flex-col"
    >
      {children}
    </div>
  );
}

export default AuthLayout;
