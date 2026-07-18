import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../theme.css";
import "../login/LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    setStatus("submitting");

    navigate("/dashboard");

    // try {
    //   if (onLogin) {
    //     await onLogin({ email, password, remember });
    //   } else {
    //     await new Promise((res) => setTimeout(res, 900));
    //   }
    // } catch (err) {
    //   setStatus("error");
    //   setError(err?.message ?? "Couldn't sign you in. Please try again.");
    //   return;
    // }
    setStatus("idle");
  }

  return (
    <div className="gv-scope gv-login">
      {/* Left panel — brand + ornamental line art */}
      <div className="gv-login-panel">
        <div className="gv-login-brand">
          <span className="gv-mark" />
          GoldVault
        </div>

        <NecklaceArt />

        <div className="gv-login-tagline">
          <h1>Save a little.
            <br />
            Wear a lot.</h1>
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

      {/* Right panel — form */}
      <div className="gv-login-formside">
        <form className="gv-login-form" onSubmit={handleSubmit} noValidate>
          <div className="gv-login-formhead">
            <p className="gv-eyebrow">Welcome back</p>
            <h2>Sign in to your vault</h2>
          </div>

          <label className="gv-field">
            <span>Email</span>
            <div className="gv-input-wrap">
              <Mail size={16} className="gv-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="gv-field">
            <span>Password</span>
            <div className="gv-input-wrap">
              <Lock size={16} className="gv-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="gv-input-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && <p className="gv-form-error">{error}</p>}

          <div className="gv-login-row">
            <label className="gv-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="gv-link">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="gv-btn gv-btn-gold gv-login-submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Signing in…" : "Sign in"}
          </button>

          <p className="gv-login-foot">
            New to GoldVault? <a href="#">Open an account</a>
          </p>
        </form>
      </div>
    </div>
  );
}

/* Ornamental line-art necklace, drawn in the brand gold. Pure decoration —
   grounds the dark panel in the subject (jewelry) without a stock photo. */
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
      <circle cx="160" cy="132" r="10" stroke="var(--gold-bright)" strokeWidth="1.5" />
      <circle cx="160" cy="132" r="3" fill="var(--gold-bright)" />
      <circle cx="130" cy="122" r="3" fill="var(--gold)" />
      <circle cx="190" cy="122" r="3" fill="var(--gold)" />
      <circle cx="105" cy="105" r="2.5" fill="var(--gold-dim)" />
      <circle cx="215" cy="105" r="2.5" fill="var(--gold-dim)" />
    </svg>
  );
}
