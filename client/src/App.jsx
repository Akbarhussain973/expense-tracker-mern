// client/src/App.jsx
import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch("http://localhost:3000", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("server unreachable"));
  }, []);

  return <h1>API status: {status}</h1>;
}

export default App;