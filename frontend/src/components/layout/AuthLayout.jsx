import { useEffect, useState } from "react";
import Dark from "@/assets/images/bg-dark.png";
import Light from "@/assets/images/bg-light.png";
import useTheme from "@/hooks/useTheme";

// Resolve the effective theme: explicit "dark"/"light" win; "system" follows the
// OS preference and updates live when it changes.
function useIsDark(theme) {
  const [isDark, setIsDark] = useState(
    () =>
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const resolve = () =>
      setIsDark(theme === "dark" || (theme === "system" && mq.matches));
    resolve();
    if (theme === "system") {
      mq.addEventListener("change", resolve);
      return () => mq.removeEventListener("change", resolve);
    }
  }, [theme]);

  return isDark;
}

function AuthLayout({ children }) {
  const { theme } = useTheme();
  const isDark = useIsDark(theme);
  const bgImage = isDark ? Dark : Light;

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
