import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { getCurrentUser, logout as apiLogout } from "./apiService";

const AuthContext = createContext();

const IDLE_TIMEOUT = 30 * 60 * 1000;
const IDLE_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const idleTimer = useRef(null);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    apiLogout().catch(() => {});
  };

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(logout, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    if (!savedToken) {
      setIsLoading(false);
      return undefined;
    }

    getCurrentUser()
      .then(({ user: currentUser }) => {
        setUser(currentUser);
        setToken(savedToken);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));

    return undefined;
  }, []);

  useEffect(() => {
    if (!token) {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      return;
    }

    resetIdleTimer();
    IDLE_EVENTS.forEach((e) => window.addEventListener(e, resetIdleTimer));

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, resetIdleTimer));
    };
  }, [token]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        setUser,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
