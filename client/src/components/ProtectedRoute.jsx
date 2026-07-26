import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState("checking"); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

      fetch(`${API_URL}/`, {
        credentials: "include",
        headers,
      })
      .then((res) => {
        setAuthStatus(res.ok ? "authed" : "guest");
      })
      .catch(() => setAuthStatus("guest"));
  }, []);

  if (authStatus === "checking") return <p>Loading...</p>;
  if (authStatus === "guest") return <Navigate to="/login" />;
  return children;
}

export default ProtectedRoute;
