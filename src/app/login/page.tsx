"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const user = users.find(
        (u: { email: string; password: string }) =>
          u.email === email && u.password === password
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      localStorage.setItem("loggedInUser", email);
      document.cookie = "loggedIn=true; path=/; max-age=86400; SameSite=Lax";

      window.dispatchEvent(new Event("authChange"));

      alert("Login successful.");
      router.push("/");
    } catch {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              type="email"
              placeholder="Enter email"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              type="password"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="auth-btn">
            Login
          </button>

          <p className="switch-text">
            Don’t have an account? <Link href="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
