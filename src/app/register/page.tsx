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

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

      const exists = users.some((u) => u.email === email);
      if (exists) {
        setError("User with this email already exists.");
        return;
      }

      const newUser: User = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Set auth cookie and loggedInUser localStorage
      localStorage.setItem("loggedInUser", email);
      document.cookie = "loggedIn=true; path=/; max-age=86400; SameSite=Lax";

      window.dispatchEvent(new Event("authChange"));

      alert("Registration successful! You are now logged in.");

      // Redirect to home or dashboard
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    }
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
