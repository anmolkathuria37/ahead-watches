import { useState } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("admin_token")
  );

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return <AdminDashboard />;
}
