import { useState } from "react";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch(
      import.meta.env.VITE_API_URL + "/api/admin/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("admin_token", data.token);
      onLogin();
    } else {
      alert(data.message || "Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-8 w-96 rounded">
        <h2 className="text-white text-xl mb-4">Admin Login</h2>

        <input
          className="w-full p-2 bg-zinc-800 text-white rounded mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 bg-zinc-800 text-white rounded mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-white text-black py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
