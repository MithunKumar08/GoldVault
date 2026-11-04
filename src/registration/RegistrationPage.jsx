import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../theme.css";
import "../registration/RegistrationPage.css";
import ApiService from "../APIService/ApiService";

export default function RegistrationPage({ onLogin }) {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // -------------------------
    // Username validation
    // Backend:
    // ^(?=.*\d)[a-zA-Z][a-zA-Z0-9]{4,}$
    // -------------------------
    if (!userName.trim()) {
      setError("User Name is required.");
      return;
    }

    const userNameRegex = /^(?=.*\d)[a-zA-Z][a-zA-Z0-9]{4,}$/;

    if (!userNameRegex.test(userName)) {
      setError(
        "Username must start with a letter, contain at least 5 characters, and include at least one number."
      );
      return;
    }

    // -------------------------
    // Email validation
    // -------------------------
    if (!emailId.trim()) {
      setError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailId)) {
      setError("Please enter a valid email address.");
      return;
    }

    // -------------------------
    // Password validation
    // Backend:
    // ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$
    // -------------------------
    if (!password) {
      setError("Password is required.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      );
      return;
    }

    // -------------------------
    // Mobile validation
    // Backend:
    // ^[6-9]\d{9}$
    // -------------------------
    if (!mobileNo.trim()) {
      setError("Mobile number is required.");
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobileNo)) {
      setError(
        "Mobile number must be 10 digits and start with 6, 7, 8, or 9."
      );
      return;
    }

    // -------------------------
    // API call
    // -------------------------
    try {
      setStatus("submitting");

      const response = await ApiService.registerUser({
        userName: userName,
        emailId: emailId,
        password: password,
        mobileNo: mobileNo,
      });

      console.log("Registration successful:", response);

      if (onLogin) {
        onLogin(response);
      }

      navigate("/dashboard");

    } catch (error) {

    console.error("Register Error:", error);

    if (error.response?.status === 400) {
        setError(
            error.response?.data?.message ||
            "User Already Exists. Please Login...."
        );
    } else {
        setError("Registration failed. Please try again.");
    }
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="gv-scope gv-login">

      {/* Left panel */}
      <div className="gv-login-panel">

        <div className="gv-login-brand">
          <span className="gv-mark" />
          GoldVault
        </div>

        <NecklaceArt />

        <div className="gv-login-tagline">
          <h1>
            Save a little.
            <br />
            Wear a lot.
          </h1>

          <p>
            Every deposit is weighed in real gold. When you're ready, walk
            into any partner store and wear what you saved.
          </p>
        </div>

        <div className="gv-login-trust">
          <ShieldCheck size={16} />
          Holdings insured &amp; audited quarterly
        </div>

      </div>

      {/* Right panel */}
      <div className="gv-login-formside">

        <form
          className="gv-login-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="gv-login-formhead">
            <p className="gv-eyebrow">Create your account</p>

            <h2>Sign up to your vault</h2>
          </div>

          {/* Username */}
          <label className="gv-field">
            <span>User Name</span>

            <div className="gv-input-wrap">
              <User size={16} className="gv-input-icon" />

              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="UserName08"
                autoComplete="username"
              />
            </div>
          </label>

          {/* Email */}
          <label className="gv-field">
            <span>Email</span>

            <div className="gv-input-wrap">
              <Mail size={16} className="gv-input-icon" />

              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </label>

          {/* Password */}
          <label className="gv-field">
            <span>Password</span>

            <div className="gv-input-wrap">
              <Lock size={16} className="gv-input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="gv-input-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </label>

          {/* Mobile Number */}
          <label className="gv-field">
            <span>Mobile Number</span>

            <div className="gv-input-wrap">
              <Phone size={16} className="gv-input-icon" />

              <input
                type="tel"
                value={mobileNo}
                onChange={(e) =>
                  setMobileNo(e.target.value.replace(/\D/g, ""))
                }
                placeholder="9876543210"
                maxLength={10}
                autoComplete="tel"
              />
            </div>
          </label>

          {/* Error */}
          {error && (
            <p className="gv-form-error">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="gv-btn gv-btn-gold gv-login-submit"
            disabled={status === "submitting"}
          >
            {status === "submitting"
              ? "Creating account…"
              : "Sign up"}
          </button>

          <p className="gv-login-foot">
            Already have an account?{" "}
            <button
              type="button"
              className="gv-link-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>

        </form>

      </div>
    </div>
  );
}


/*
 * Ornamental necklace
 */
function NecklaceArt() {
  return (
    <svg
      className="gv-necklace"
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        className="gv-necklace-chain"
        d="M20 20 C 60 90, 120 130, 160 132 C 200 130, 260 90, 300 20"
        stroke="var(--gold)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <circle
        cx="160"
        cy="132"
        r="10"
        stroke="var(--gold-bright)"
        strokeWidth="1.5"
      />

      <circle
        cx="160"
        cy="132"
        r="3"
        fill="var(--gold-bright)"
      />

      <circle
        cx="130"
        cy="122"
        r="3"
        fill="var(--gold)"
      />

      <circle
        cx="190"
        cy="122"
        r="3"
        fill="var(--gold)"
      />

      <circle
        cx="105"
        cy="105"
        r="2.5"
        fill="var(--gold-dim)"
      />

      <circle
        cx="215"
        cy="105"
        r="2.5"
        fill="var(--gold-dim)"
      />
    </svg>
  );
}
