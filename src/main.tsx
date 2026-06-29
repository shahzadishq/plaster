import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/legacy.css";
import App from "./App";

// The custom admin lives at /admin and is code-split so it never ships with the
// public site bundle (and vice-versa).
const Admin = lazy(() => import("./admin/Admin"));
const isAdmin = window.location.pathname.replace(/\/+$/, "").endsWith("/admin");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
