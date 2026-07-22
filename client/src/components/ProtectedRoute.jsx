import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState("checking"); 

  useEffect(() => {
    fetch("http://localhost:3000/", { credentials: "include" })
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
