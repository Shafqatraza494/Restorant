"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      const user = data.user;

      localStorage.setItem("loggedInUser", JSON.stringify(user));

      document.cookie =
        "loggedIn=true; path=/; max-age=86400; SameSite=None; Secure";

      if (user.role == "admin") {
        document.cookie =
          "role=admin; path=/; max-age=86400; SameSite=None; Secure;";
      } else {
        document.cookie =
          "role=user; path=/; max-age=86400; SameSite=None; Secure;";
      }
      window.dispatchEvent(new Event("authChange"));
      if (res.ok) {
        toast.success("Login Successful!");
        console.log(res);
      }

      setTimeout(() => {
        router.push("/");
        // window.location.reload();
      }, 1200);
    } catch (error: any) {
      toast.error("Server Error: " + error.message);
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
            />
          </div>

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
