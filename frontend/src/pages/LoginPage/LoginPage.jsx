import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | ok
  const inputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("email required");
      return;
    }

    setStatus("checking");
    try {
      const data = await login(email.trim());
      setStatus("ok");
      // brief pause so the "authenticated" state is visible before navigating
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      setStatus("idle");
      setError(err.message || "login failed, try again");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__grid" aria-hidden="true" />

      <div className="terminal-window">
        <div className="terminal-window__titlebar">
          <div className="terminal-window__dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="terminal-window__tab">login.sh</span>
        </div>

        <div className="terminal-window__body">
          <div className="terminal-brand">
            <span className="terminal-brand__bracket">&lt;</span>
            CodeTrack
            <span className="terminal-brand__bracket">/&gt;</span>
          </div>
          <p className="terminal-subtext">
            track every contest, every sheet, and every solve — all in
            one place, so nothing slips through the cracks.
          </p>

          <form onSubmit={handleSubmit} className="terminal-form" noValidate>
            <label htmlFor="email" className="terminal-line terminal-line--label">
              <span className="terminal-prompt">$</span> codetrack --login
            </label>

            <div className={`terminal-input-row ${status === "checking" ? "is-busy" : ""}`}>
              <span className="terminal-prompt">&gt;</span>
              <input
                id="email"
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "checking" || status === "ok"}
                className="terminal-input"
              />
              <span className="terminal-cursor" aria-hidden="true" />
            </div>

            {error && (
              <div className="terminal-line terminal-line--error">
                <span className="terminal-prompt terminal-prompt--error">✗</span> error: {error}
              </div>
            )}

            {status === "checking" && (
              <div className="terminal-line terminal-line--muted">
                <span className="terminal-prompt">·</span> resolving account
                <span className="terminal-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            )}

            {status === "ok" && (
              <div className="terminal-line terminal-line--success">
                <span className="terminal-prompt terminal-prompt--success">✓</span> authenticated, entering session
              </div>
            )}

            <button
              type="submit"
              className="terminal-submit"
              disabled={status === "checking" || status === "ok" || !email}
            >
              {status === "checking" ? "$ signing-in..." : "$ sign-in"}
            </button>
          </form>

          <p className="terminal-footnote">
            no account yet? one is created automatically on first login.
          </p>
        </div>
      </div>
    </div>
  );
}