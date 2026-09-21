import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BG_IMAGE =
  "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0";

// FastAPI backend ka URL - agar backend kisi doosre port/host par ho to yahan badal do
// const API_URL = "http://localhost:8000";
// const API_URL = "http://15.206.149.37:8080";
const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com"

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // email ya username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.detail || "Login failed. Try again.");
        return;
      }

      login(result.user); // global auth state update - Navbar ko turant pata chal jayega
      if (onLoginSuccess) onLoginSuccess(result.user);
      navigate("/"); // login ke baad homepage par bhej do
    } catch (err) {
      setError("Server se connect nahi ho paya. Kya backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl px-8 py-10">
        <h1 className="text-2xl font-semibold text-white text-center">
          Welcome back
        </h1>
        <p className="text-sm text-white/70 text-center mt-1 mb-8">
          Login with your email or username
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or username"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 pr-16 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-gray-900 font-medium py-2.5 hover:bg-white/90 active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-white/70 text-center mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-white font-medium underline underline-offset-2 hover:text-white/80"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
