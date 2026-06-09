import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    name: "Strathmore University",
    role: "manager",
  });

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
