import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BG_IMAGE =
  "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0";

// FastAPI backend ka URL - agar backend kisi doosre port/host par ho to yahan badal do
// const API_URL = "http://localhost:8000";
const API_URL = "http://15.206.149.37:8080";

export default function Signup({ onSignupSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.detail || "Signup failed. Try again.");
        return;
      }

      setSuccess("Account created!");
      login(result.user); // signup hote hi login state bhi set kar do
      if (onSignupSuccess) onSignupSuccess(result.user);
      setTimeout(() => navigate("/"), 800); // seedha homepage par bhej do
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
          Create account
        </h1>
        <p className="text-sm text-white/70 text-center mt-1 mb-8">
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">
              Full name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Your name"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={handleChange("username")}
              placeholder="username"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 transition"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-300 bg-green-500/10 border border-green-400/30 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-gray-900 font-medium py-2.5 hover:bg-white/90 active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-white/70 text-center mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-white font-medium underline underline-offset-2 hover:text-white/80"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
