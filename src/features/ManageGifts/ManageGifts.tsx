import { useState } from "react";
import StaffNavbar from "../../components/StaffNavbar";

/* ── Types ── */
interface Hadiah {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string;
  penyedia: string;
  miles: number;
  validStart: string;
  validEnd: string;
}

interface FormState {
  nama: string;
  penyedia: string;
  miles: string;
  deskripsi: string;
  validStart: string;
  validEnd: string;
}

//placeholder data
const PENYEDIA_LIST = [
  "Garuda Indonesia", "Lion Air", "Batik Air", "Citilink",
  "AirAsia Indonesia", "Singapore Airlines", "Malaysia Airlines",
  "Thai Airways", "Cathay Pacific", "Emirates", "Qatar Airways",
];

const EMPTY_FORM: FormState = {
  nama: "", penyedia: "", miles: "", deskripsi: "", validStart: "", validEnd: "",
};

let nextId = 3;
const INITIAL_DATA: Hadiah[] = [
  { id: 1, kode: "RWD-001", nama: "Free Cabin Upgrade", deskripsi: "Upgrade to business class on select routes", penyedia: "Garuda Indonesia", miles: 15000, validStart: "2025-01-01", validEnd: "2025-12-31" },
  { id: 2, kode: "RWD-002", nama: "Airport Lounge Access", deskripsi: "Access to premium lounges at major airports", penyedia: "Lion Air", miles: 8000, validStart: "2025-03-01", validEnd: "2025-09-30" },
];

function generateKode(id: number) {
  return `RWD-${String(id).padStart(3, "0")}`;
}

/* ── Modal wrapper ── */
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ── Form fields for add and edit── */
function HadiahForm({
  form, setForm, onSubmit, onCancel, submitLabel, isSubmitting,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting: boolean;
}) {
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div style={fs.wrapper}>
      {/* Nama */}
      <div style={fs.group}>
        <label style={fs.label}>Nama Hadiah</label>
        <input style={fs.input} type="text" placeholder="e.g. Free Cabin Upgrade" value={form.nama} onChange={set("nama")} />
      </div>

      {/* Penyedia */}
      <div style={fs.group}>
        <label style={fs.label}>Penyedia</label>
        <div style={fs.selectWrap}>
          <select style={fs.select} value={form.penyedia} onChange={set("penyedia")}>
            <option value="">Pilih maskapai...</option>
            {PENYEDIA_LIST.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <span style={fs.arrow}>▾</span>
        </div>
      </div>

      {/* Miles */}
      <div style={fs.group}>
        <label style={fs.label}>Miles Cost</label>
        <input style={fs.input} type="number" placeholder="e.g. 15000" value={form.miles} onChange={set("miles")} min={0} />
      </div>

      {/* Description */}
      <div style={fs.group}>
        <label style={fs.label}>Deskripsi</label>
        <textarea style={fs.textarea} placeholder="Describe the reward..." value={form.deskripsi} onChange={set("deskripsi")} rows={3} />
      </div>

      {/* Valid dates */}
      <div style={fs.row}>
        <div style={fs.group}>
          <label style={fs.label}>Valid Start</label>
          <input style={fs.input} type="date" value={form.validStart} onChange={set("validStart")} />
        </div>
        <div style={fs.group}>
          <label style={fs.label}>Valid End</label>
          <input style={fs.input} type="date" value={form.validEnd} onChange={set("validEnd")} />
        </div>
      </div>

      {/* Actions */}
      <div style={fs.btnRow}>
        <button type="button" style={fs.cancelBtn} onClick={onCancel}>Batal</button>
        <button
          type="button"
          style={{ ...fs.submitBtn, ...(isSubmitting ? fs.submitBtnDim : {}) }}
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan…" : submitLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function KelolaHadiah() {
  const [data, setData] = useState<Hadiah[]>(INITIAL_DATA);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected = data.find(d => d.id === selectedId) ?? null;

  /* Open add */
  const openAdd = () => { setForm(EMPTY_FORM); setModal("add"); };

  /* Open edit */
  const openEdit = (h: Hadiah) => {
    setSelectedId(h.id);
    setForm({
      nama: h.nama, penyedia: h.penyedia, miles: String(h.miles),
      deskripsi: h.deskripsi, validStart: h.validStart, validEnd: h.validEnd,
    });
    setModal("edit");
  };

  /* Open delete */
  const openDelete = (id: number) => { setSelectedId(id); setModal("delete"); };

  const closeModal = () => { setModal(null); setSelectedId(null); };

  /* Submit add */
  const handleAdd = async () => {
    if (!form.nama || !form.penyedia || !form.miles) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const id = nextId++;
    setData(prev => [...prev, {
      id, kode: generateKode(id), nama: form.nama, deskripsi: form.deskripsi,
      penyedia: form.penyedia, miles: Number(form.miles),
      validStart: form.validStart, validEnd: form.validEnd,
    }]);
    setIsSubmitting(false);
    closeModal();
  };

  /* Submit edit */
  const handleEdit = async () => {
    if (!form.nama || !form.penyedia || !form.miles || !selectedId) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setData(prev => prev.map(h => h.id === selectedId
      ? { ...h, nama: form.nama, deskripsi: form.deskripsi, penyedia: form.penyedia, miles: Number(form.miles), validStart: form.validStart, validEnd: form.validEnd }
      : h
    ));
    setIsSubmitting(false);
    closeModal();
  };

  /* Confirm delete */
  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    setData(prev => prev.filter(h => h.id !== selectedId));
    setIsSubmitting(false);
    closeModal();
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");
  const truncate = (s: string, n: number) => s.length > n ? s.slice(0, n) + "…" : s;

  return (
    <div style={ps.root}>
      <style>{css}</style>
      <StaffNavbar />

      {/* ── Scrollable main area ── */}
      <main style={ps.main}>
        {/* Page header */}
        <div style={ps.pageHeader}>
          <h1 style={ps.pageTitle}>Kelola Hadiah</h1>
          <button type="button" style={ps.addBtn} onClick={openAdd}>
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span> Tambah Hadiah
          </button>
        </div>

        {/* Table card */}
        <div style={ps.card}>
          <table style={ps.table}>
            <thead>
              <tr>
                {["Kode", "Nama", "Deskripsi", "Penyedia", "Miles", "Periode", "Aksi"].map(h => (
                  <th key={h} style={{ ...ps.th, ...(h === "Aksi" ? { textAlign: "center" } : {}) }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} style={ps.emptyCell}>Belum ada hadiah. Tambahkan hadiah baru!</td>
                </tr>
              ) : data.map((h, i) => (
                <tr key={h.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(91,128,232,0.03)" }}
                  className="table-row">
                  <td style={ps.td}>{h.kode}</td>
                  <td style={ps.td}>{truncate(h.nama, 22)}</td>
                  <td style={ps.td}>{truncate(h.deskripsi, 28)}</td>
                  <td style={ps.td}>{truncate(h.penyedia, 22)}</td>
                  <td style={ps.td}>{fmt(h.miles)}</td>
                  <td style={ps.td}>
                    {h.validStart && h.validEnd
                      ? `${h.validStart} – ${h.validEnd}`
                      : <span style={{ color: "#bbb" }}>—</span>}
                  </td>
                  <td style={{ ...ps.td, textAlign: "center" }}>
                    <div style={ps.actionCell}>
                      <button type="button" style={ps.iconBtn} title="Edit" onClick={() => openEdit(h)}>
                        <PencilIcon />
                      </button>
                      <button type="button" style={{ ...ps.iconBtn, ...ps.iconBtnDelete }} title="Hapus" onClick={() => openDelete(h.id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Add modal ── */}
      {modal === "add" && (
        <Modal onClose={closeModal}>
          <h2 style={ms.title}>Tambah Hadiah</h2>
          <p style={ms.subtitle}>Isi detail hadiah baru</p>
          <HadiahForm form={form} setForm={setForm} onSubmit={handleAdd} onCancel={closeModal} submitLabel="Tambah Hadiah" isSubmitting={isSubmitting} />
        </Modal>
      )}

      {/* ── Edit modal ── */}
      {modal === "edit" && (
        <Modal onClose={closeModal}>
          <h2 style={ms.title}>Edit Hadiah</h2>
          <p style={ms.subtitle}>Perbarui detail hadiah — {selected?.kode}</p>
          <HadiahForm form={form} setForm={setForm} onSubmit={handleEdit} onCancel={closeModal} submitLabel="Simpan Perubahan" isSubmitting={isSubmitting} />
        </Modal>
      )}

      {/* ── Delete modal ── */}
      {modal === "delete" && (
        <Modal onClose={closeModal}>
          <div style={ms.deleteBox}>
            <div style={ms.deleteIcon}>🗑️</div>
            <h2 style={ms.title}>Hapus Hadiah?</h2>
            <p style={ms.deleteMsg}>
              Anda akan menghapus <strong>{selected?.nama ?? "hadiah ini"}</strong> ({selected?.kode}).
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={fs.btnRow}>
              <button type="button" style={fs.cancelBtn} onClick={closeModal}>Batal</button>
              <button
                type="button"
                style={{ ...fs.submitBtn, background: "linear-gradient(135deg,#f87171,#dc2626)", boxShadow: "0 4px 14px rgba(220,38,38,0.3)", ...(isSubmitting ? fs.submitBtnDim : {}) }}
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menghapus…" : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── SVG Icons ── */
function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

/* ── Styles ── */
const ps: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #c8d8f8 0%, #dde8f8 35%, #eee8dc 70%, #f5f0e8 100%)",
    fontFamily: "'Nunito', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "36px 48px 64px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
  },
  pageTitle: {
    fontSize: "1.75rem",
    fontWeight: 900,
    color: "#1e2a52",
    margin: 0,
    fontFamily: "'Nunito Sans', sans-serif",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 22px",
    borderRadius: "14px",
    border: "none",
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(10px)",
    color: "#1e2a52",
    fontWeight: 800,
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    boxShadow: "0 2px 12px rgba(91,128,232,0.15)",
    transition: "background 0.2s, box-shadow 0.2s",
  },
  card: {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(80,100,180,0.10)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "16px 20px",
    fontSize: "0.85rem",
    fontWeight: 800,
    color: "#4a5578",
    textAlign: "left",
    borderBottom: "1.5px solid #e8edf8",
    fontFamily: "'Nunito Sans', sans-serif",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  td: {
    padding: "15px 20px",
    fontSize: "0.9rem",
    color: "#2d3a5e",
    borderBottom: "1px solid #f0f3fb",
    verticalAlign: "middle",
  },
  emptyCell: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#9aa5c4",
    fontSize: "0.95rem",
  },
  actionCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  iconBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    border: "1.5px solid #e0e6f5",
    background: "transparent",
    color: "#4a5578",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
  },
  iconBtnDelete: {
    color: "#dc2626",
    borderColor: "#fecaca",
  },
};

const ms: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(30,42,82,0.35)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.18s ease",
  },
  modal: {
    background: "#fff",
    borderRadius: "20px",
    padding: "36px 40px 32px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(30,42,82,0.2)",
    animation: "slideUp 0.22s ease",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  title: {
    fontSize: "1.35rem",
    fontWeight: 900,
    color: "#1e2a52",
    margin: "0 0 4px",
    fontFamily: "'Nunito Sans', sans-serif",
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "#8892b0",
    margin: "0 0 24px",
  },
  deleteBox: {
    textAlign: "center",
    padding: "8px 0",
  },
  deleteIcon: {
    fontSize: "2.5rem",
    marginBottom: "12px",
  },
  deleteMsg: {
    fontSize: "0.9rem",
    color: "#4a5578",
    lineHeight: 1.6,
    margin: "12px 0 28px",
  },
};

const fs: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", flexDirection: "column", gap: "14px" },
  group: { display: "flex", flexDirection: "column", gap: "5px", flex: 1 },
  row: { display: "flex", gap: "14px" },
  label: { fontSize: "0.82rem", fontWeight: 700, color: "#2d3a5e" },
  input: {
    padding: "10px 13px",
    borderRadius: "10px",
    border: "1.5px solid #dde3f4",
    background: "#fafbff",
    fontSize: "0.9rem",
    color: "#1e2a52",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    fontFamily: "'Nunito', sans-serif",
    transition: "border-color 0.18s",
  },
  textarea: {
    padding: "10px 13px",
    borderRadius: "10px",
    border: "1.5px solid #dde3f4",
    background: "#fafbff",
    fontSize: "0.9rem",
    color: "#1e2a52",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    fontFamily: "'Nunito', sans-serif",
    resize: "vertical" as const,
    transition: "border-color 0.18s",
  },
  selectWrap: { position: "relative" },
  select: {
    padding: "10px 34px 10px 13px",
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
  },
  arrow: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#9aa5c4",
    fontSize: "0.85rem",
  },
  btnRow: { display: "flex", gap: "12px", marginTop: "6px" },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "11px",
    border: "1.5px solid #d0d8ef",
    background: "transparent",
    color: "#4a5578",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
  },
  submitBtn: {
    flex: 2,
    padding: "12px",
    borderRadius: "11px",
    border: "none",
    background: "linear-gradient(135deg,#6a90f0,#4d6fe0)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    boxShadow: "0 4px 14px rgba(77,111,224,0.3)",
    transition: "opacity 0.2s",
  },
  submitBtnDim: { opacity: 0.65, cursor: "not-allowed" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@900&family=Nunito:wght@400;700;800&display=swap');

  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }

  .table-row:hover td { background: rgba(91,128,232,0.05) !important; }

  input:focus, select:focus, textarea:focus {
    border-color: #5b80e8 !important;
    background: #fff !important;
  }
  button[type="button"]:not(:disabled):hover { opacity: 0.82; }
`;