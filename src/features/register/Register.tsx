import { useState } from "react";
import { useNavigate } from "react-router-dom";
import planePhoto from "../../assets/planePhoto.avif";

type Role = "member" | "staff";
type Salutation = "Mr." | "Ms." | "Mrs.";

const COUNTRIES = [
  "Indonesia", "United States", "United Kingdom", "Australia", "Singapore",
  "Malaysia", "Japan", "South Korea", "Germany", "France", "Netherlands",
  "Canada", "India", "Thailand", "Vietnam", "Philippines",
];

const AIRLINES = [
  "Garuda Indonesia", "Lion Air", "Batik Air", "Citilink", "AirAsia Indonesia",
  "Singapore Airlines", "Malaysia Airlines", "Thai Airways", "Cathay Pacific",
  "Emirates", "Qatar Airways", "Turkish Airlines", "Lufthansa", "British Airways",
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("member");
  const [salutation, setSalutation] = useState<Salutation>("Mr.");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [airline, setAirline] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (role === "staff" && !airline) {
      setError("Please select an airline.");
      return;
    }
    setError("");
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 900));
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── Left: scrollable form panel ── */}
      <div style={s.formPanel}>
        <div style={s.formInner}>

          {/* Logo */}
          <div style={s.logoRow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 14 14" aria-hidden="true">
              <g fill="none">
                <path fill="#fff" d="M5.55 6.258c.29-.288.68-.45 1.088-.45h3.076a5.002 5.002 0 0 1-2.306 7.316v-3.47a.77.77 0 0 0-.77-.77a1.538 1.538 0 0 1-1.087-2.626M3.51 9.72a1.54 1.54 0 0 0-1.087-.45H.56a5.01 5.01 0 0 0 3.403 3.989v-2.451c0-.408-.163-.8-.451-1.088"/>
                <path fill="#d7e0ff" d="M5.26 3.506a5 5 0 0 0-4.7 5.763h1.864a1.54 1.54 0 0 1 1.539 1.539v2.45A5 5 0 0 0 5.5 13.5c.676 0 1.32-.134 1.908-.377v-3.47a.77.77 0 0 0-.77-.768a1.538 1.538 0 0 1 0-3.077h.765a.4.4 0 0 1-.043-.098l-.49-1.68l-.26-.09z"/>
                <path fill="#fff" d="m13.26 1.97l-1-.34a.34.34 0 0 0-.39.13l-.73 1.13l-4-2A2.49 2.49 0 0 0 3.53 2.2a.68.68 0 0 0 .47.9l2.61.84l.26.09l.49 1.68a.36.36 0 0 0 .24.25l1.18.38a.37.37 0 0 0 .48-.41L9 4.68h.17l2.55.83a.67.67 0 0 0 .85-.41l.9-2.77a.34.34 0 0 0-.21-.36"/>
                <path stroke="#4147d5" strokeLinecap="round" strokeLinejoin="round" d="m13.26 1.97l-1-.34a.34.34 0 0 0-.39.13l-.73 1.13l-4-2A2.49 2.49 0 0 0 3.53 2.2a.68.68 0 0 0 .47.9l2.61.84l.26.09l.49 1.68a.36.36 0 0 0 .24.25l1.18.38a.37.37 0 0 0 .48-.41L9 4.68h.17l2.55.83a.67.67 0 0 0 .85-.41l.9-2.77a.34.34 0 0 0-.21-.36M10.5 8.5a5 5 0 1 1-8.25-3.8" strokeWidth="1"/>
                <path stroke="#4147d5" strokeLinecap="round" strokeLinejoin="round" d="M5.28 6.65a1.6 1.6 0 0 0-.046 1.287a1.52 1.52 0 0 0 1.416.943a.77.77 0 0 1 .77.77v3.47M.57 9.27h1.85A1.54 1.54 0 0 1 4 10.81v2.45" strokeWidth="1"/>
              </g>
            </svg>
            <span style={s.logoText}>
              <span style={s.logoAero}>Aero</span>
              <span style={s.logoMiles}>Miles</span>
            </span>
          </div>

          {/* Heading */}
          <div style={s.heading}>
            <h1 style={s.title}>Create Account</h1>
            <p style={s.subtitle}>Choose your role and fill out the form</p>
          </div>

          {/* Role toggle */}
          <div style={s.roleToggle}>
            <button
              type="button"
              style={{ ...s.roleBtn, ...(role === "member" ? s.roleBtnActive : {}) }}
              onClick={() => setRole("member")}
            >
              Member
            </button>
            <button
              type="button"
              style={{ ...s.roleBtn, ...(role === "staff" ? s.roleBtnActive : {}) }}
              onClick={() => setRole("staff")}
            >
              Staff
            </button>
          </div>

          {/* Email */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="e.g. john.doe@email.com"
              value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>

          {/* Password row */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Min. 8 characters"
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Confirm Password</label>
              <input style={s.input} type="password" placeholder="Re-enter password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
            </div>
          </div>

          {/* Salutations */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Salutations</label>
            <div style={s.salutationGroup}>
              {(["Mr.", "Ms.", "Mrs."] as Salutation[]).map(sal => (
                <button
                  key={sal}
                  type="button"
                  style={{ ...s.salBtn, ...(salutation === sal ? s.salBtnActive : {}) }}
                  onClick={() => setSalutation(sal)}
                >
                  {sal}
                </button>
              ))}
            </div>
          </div>

          {/* Name row */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>First Name</label>
              <input style={s.input} type="text" placeholder="e.g. John"
                value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Last Name</label>
              <input style={s.input} type="text" placeholder="e.g. Doe"
                value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" />
            </div>
          </div>

          {/* Phone row */}
          <div style={s.row}>
            <div style={{ ...s.fieldGroup, flex: "0 0 110px" }}>
              <label style={s.label}>Country Code</label>
              <input style={s.input} type="text" placeholder="+62"
                value={countryCode} onChange={e => setCountryCode(e.target.value)} autoComplete="tel-country-code" />
            </div>
            <div style={{ ...s.fieldGroup, flex: 1 }}>
              <label style={s.label}>Phone Number</label>
              <input style={s.input} type="tel" placeholder="e.g. 812 3456 7890"
                value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel-local" />
            </div>
          </div>

          {/* DOB + Nationality */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Tanggal Lahir</label>
              <div style={s.dateWrapper}>
                <svg style={s.calIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa5c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input style={{ ...s.input, paddingLeft: "36px" }} type="text" placeholder="DD/MM/YYYY"
                  value={dob} onChange={e => setDob(e.target.value)} />
              </div>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Kewarganegaraan</label>
              <div style={s.selectWrapper}>
                <select style={s.select} value={nationality} onChange={e => setNationality(e.target.value)}>
                  <option value="">Pilih negara...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span style={s.selectArrow}>▾</span>
              </div>
            </div>
          </div>

          {/* Staff-only: Pilih Maskapai */}
          {role === "staff" && (
            <div style={{ ...s.fieldGroup, animation: "fadeUp 0.25s ease both" }}>
              <label style={s.label}>Pilih Maskapai</label>
              <div style={s.selectWrapper}>
                <select style={s.select} value={airline} onChange={e => setAirline(e.target.value)}>
                  <option value="">Pilih maskapai...</option>
                  {AIRLINES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <span style={s.selectArrow}>▾</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <p style={s.error}>{error}</p>}

          {/* Buttons */}
          <div style={s.btnRow}>
            <button type="button" style={s.cancelBtn} onClick={() => navigate("/login")}>
              Cancel
            </button>
            <button
              type="button"
              style={{ ...s.registerBtn, ...(isLoading ? s.registerBtnLoading : {}) }}
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Registering…" : "Register"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: sticky photo panel ── */}
      <div style={s.photoPanel}>
        <img src={planePhoto} alt="Airplane in flight" style={s.photo} />
      </div>
    </div>
  );
}

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Nunito', sans-serif",
    background: "#fff",
  },

  /* Left scrollable panel */
  formPanel: {
    flex: "0 0 52%",
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "100vh",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  formInner: {
    padding: "48px 24px 64px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    width: "100%",
    maxWidth: "420px",
  },

  /* Logo */
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "4px",
  },
  logoText: {
    fontSize: "1.9rem",
    fontWeight: 900,
    fontFamily: "'Nunito Sans', sans-serif",
    letterSpacing: "-0.3px",
    lineHeight: 1,
  },
  logoAero: { color: "#1e2a52" },
  logoMiles: { color: "#5b80e8" },

  /* Heading */
  heading: { marginBottom: "2px" },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#1e2a52",
    margin: 0,
    fontFamily: "'Nunito Sans', sans-serif",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#8892b0",
    margin: "4px 0 0",
  },

  /* Role toggle */
  roleToggle: {
    display: "flex",
    border: "1.5px solid #d4daf0",
    borderRadius: "12px",
    overflow: "hidden",
    width: "fit-content",
  },
  roleBtn: {
    padding: "10px 36px",
    border: "none",
    background: "transparent",
    color: "#6b7a9e",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    transition: "background 0.18s, color 0.18s",
  },
  roleBtnActive: {
    background: "#5b80e8",
    color: "#fff",
    borderRadius: "10px",
  },

  /* Fields */
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
  },
  row: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-end",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#2d3a5e",
  },
  input: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #dde3f4",
    background: "#fafbff",
    fontSize: "0.9rem",
    color: "#1e2a52",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Nunito', sans-serif",
    transition: "border-color 0.18s",
  },

  /* Salutation */
  salutationGroup: {
    display: "flex",
    border: "1.5px solid #dde3f4",
    borderRadius: "10px",
    overflow: "hidden",
    width: "fit-content",
  },
  salBtn: {
    padding: "10px 28px",
    border: "none",
    borderRight: "1.5px solid #dde3f4",
    background: "transparent",
    color: "#6b7a9e",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    transition: "background 0.15s, color 0.15s",
  },
  salBtnActive: {
    background: "#5b80e8",
    color: "#fff",
  },

  /* Date input */
  dateWrapper: { position: "relative" },
  calIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  /* Select */
  selectWrapper: { position: "relative" },
  select: {
    padding: "11px 36px 11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #dde3f4",
    background: "#fafbff",
    fontSize: "0.9rem",
    color: "#1e2a52",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    appearance: "none" as const,
    fontFamily: "'Nunito', sans-serif",
    cursor: "pointer",
    transition: "border-color 0.18s",
  },
  selectArrow: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#9aa5c4",
    fontSize: "0.85rem",
  },

  /* Error */
  error: {
    color: "#e05252",
    fontSize: "0.82rem",
    margin: 0,
    textAlign: "center",
  },

  /* Bottom buttons */
  btnRow: {
    display: "flex",
    gap: "14px",
    marginTop: "6px",
  },
  cancelBtn: {
    flex: 1,
    padding: "13px",
    borderRadius: "12px",
    border: "1.5px solid #d0d8ef",
    background: "transparent",
    color: "#4a5578",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    transition: "background 0.15s",
  },
  registerBtn: {
    flex: 2,
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #6a90f0, #4d6fe0)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    boxShadow: "0 4px 14px rgba(77,111,224,0.35)",
    transition: "opacity 0.2s",
  },
  registerBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  /* Right photo panel */
  photoPanel: {
    flex: "0 0 48%",
    position: "sticky" as const,
    top: 0,
    height: "100vh",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@900&family=Nunito:wght@400;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  input:focus, select:focus {
    border-color: #5b80e8 !important;
    background: #fff !important;
  }

  button[type="button"]:not(:disabled):hover {
    opacity: 0.85;
  }
`;