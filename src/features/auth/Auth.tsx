import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    // TODO: replace with real auth logic
    await new Promise((res) => setTimeout(res, 800));
    setIsLoading(false);
    navigate("/");
  };

  const handleCancel = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div style={styles.root}>
      {/* Main content */}
      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoRow}>
          {/* Inline SVG — matches src/assets/logo.svg exactly */}
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 14 14" aria-label="AeroMiles icon">
            <g fill="none">
              <path fill="#fff" d="M5.55 6.258c.29-.288.68-.45 1.088-.45h3.076a5.002 5.002 0 0 1-2.306 7.316v-3.47a.77.77 0 0 0-.77-.77a1.538 1.538 0 0 1-1.087-2.626M3.51 9.72a1.54 1.54 0 0 0-1.087-.45H.56a5.01 5.01 0 0 0 3.403 3.989v-2.451c0-.408-.163-.8-.451-1.088"/>
              <path fill="#d7e0ff" d="M5.26 3.506a5 5 0 0 0-4.7 5.763h1.864a1.54 1.54 0 0 1 1.539 1.539v2.45A5 5 0 0 0 5.5 13.5c.676 0 1.32-.134 1.908-.377v-3.47a.77.77 0 0 0-.77-.768a1.538 1.538 0 0 1 0-3.077h.765a.4.4 0 0 1-.043-.098l-.49-1.68l-.26-.09z"/>
              <path fill="#fff" d="m13.26 1.97l-1-.34a.34.34 0 0 0-.39.13l-.73 1.13l-4-2A2.49 2.49 0 0 0 3.53 2.2a.68.68 0 0 0 .47.9l2.61.84l.26.09l.49 1.68a.36.36 0 0 0 .24.25l1.18.38a.37.37 0 0 0 .48-.41L9 4.68h.17l2.55.83a.67.67 0 0 0 .85-.41l.9-2.77a.34.34 0 0 0-.21-.36"/>
              <path stroke="#4147d5" strokeLinecap="round" strokeLinejoin="round" d="m13.26 1.97l-1-.34a.34.34 0 0 0-.39.13l-.73 1.13l-4-2A2.49 2.49 0 0 0 3.53 2.2a.68.68 0 0 0 .47.9l2.61.84l.26.09l.49 1.68a.36.36 0 0 0 .24.25l1.18.38a.37.37 0 0 0 .48-.41L9 4.68h.17l2.55.83a.67.67 0 0 0 .85-.41l.9-2.77a.34.34 0 0 0-.21-.36M10.5 8.5a5 5 0 1 1-8.25-3.8" strokeWidth="1"/>
              <path stroke="#4147d5" strokeLinecap="round" strokeLinejoin="round" d="M5.28 6.65a1.6 1.6 0 0 0-.046 1.287a1.52 1.52 0 0 0 1.416.943a.77.77 0 0 1 .77.77v3.47M.57 9.27h1.85A1.54 1.54 0 0 1 4 10.81v2.45" strokeWidth="1"/>
            </g>
          </svg>
          <span style={styles.logoText}>
            <span style={styles.logoAero}>Aero</span>
            <span style={styles.logoMiles}>Miles</span>
          </span>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            autoComplete="email"
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleSignIn(e as unknown as React.MouseEvent)}
          />

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.registerRow}>
            Don't have an account?{" "}
            <span
              style={styles.registerLink}
              onClick={() => navigate("/register")}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/register")}
            >
              Register →
            </span>
          </p>

          <div style={styles.buttonRow}>
            <button style={styles.cancelButton} onClick={handleCancel} type="button">
              Cancel
            </button>
            <button
              style={{
                ...styles.signInButton,
                ...(isLoading ? styles.signInButtonLoading : {}),
              }}
              onClick={handleSignIn}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? "Signing In…" : "Sign In"}
            </button>
          </div>
        </div>
      </div>

      <style>{cssAnimations}</style>
    </div>
  );
}

/* ── Styles ── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #c8d8f8 0%, #dde8f8 35%, #eee8dc 70%, #f5f0e8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "28px",
    zIndex: 1,
    animation: "fadeUp 0.6s ease both",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoText: {
    fontSize: "2.6rem",
    fontWeight: 900,
    fontFamily: "'Nunito Sans', sans-serif",
    letterSpacing: "-0.5px",
    lineHeight: 1,
  },
  logoAero: {
    color: "#1e2a52",
  },
  logoMiles: {
    color: "#5b80e8",
  },
  card: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    padding: "36px 40px 32px",
    width: "380px",
    boxShadow: "0 8px 40px rgba(80,100,180,0.12), 0 1px 3px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1e2a52",
    marginBottom: "4px",
    marginTop: "10px",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "50px",
    border: "1.5px solid #e0e6f5",
    background: "#f7f9ff",
    fontSize: "0.95rem",
    color: "#1e2a52",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  error: {
    color: "#e05252",
    fontSize: "0.82rem",
    margin: "4px 0 0",
    textAlign: "center",
  },
  registerRow: {
    textAlign: "center",
    fontSize: "0.82rem",
    color: "#6b7a9e",
    margin: "12px 0 4px",
  },
  registerLink: {
    color: "#5b80e8",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    transition: "opacity 0.15s",
  },
  buttonRow: {
    display: "flex",
    gap: "14px",
    marginTop: "10px",
  },
  cancelButton: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1.5px solid #d0d8ef",
    background: "transparent",
    color: "#4a5578",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s, border-color 0.15s",
  },
  signInButton: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #6a90f0, #4d6fe0)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(77,111,224,0.35)",
    transition: "opacity 0.2s, transform 0.1s",
  },
  signInButtonLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
};

const cssAnimations = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@900&family=Nunito:wght@400;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  input:focus {
    border-color: #5b80e8 !important;
    background: #fff !important;
  }

  button[type="button"]:not(:disabled):hover {
    opacity: 0.88;
  }

  [role="link"]:hover {
    opacity: 0.7;
  }
`;