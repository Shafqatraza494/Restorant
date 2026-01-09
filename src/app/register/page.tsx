"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    // 📦 Get users from localStorage
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // ❌ Duplicate email check
    const exists = users.some((u) => u.email === email);
    if (exists) {
      setError("User with this email already exists");
      return;
    }

    // ✅ Save new user

    const newUser: User = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("loggedInUser", email);

    // ✅ Middleware auth
    document.cookie = "loggedIn=true; path=/; max-age=86400";
    window.dispatchEvent(new Event("authChange"));

    alert("Registration successful! Please login.");
    window.location.reload();
    router.push("/login");
    
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="auth-btn">
            Create Account
          </button>

          <p className="switch-text">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
