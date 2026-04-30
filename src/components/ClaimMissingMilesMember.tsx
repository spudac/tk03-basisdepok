import { useState } from 'react';
import './Fitur.css';

// Types

type StatusKlaim = 'Menunggu' | 'Disetujui' | 'Ditolak';

interface Klaim {
  id: number;
  nomor_klaim: string;      
  email_member: string;
  maskapai: string;         
  bandara_asal: string; 
  bandara_tujuan: string;
  tanggal_penerbangan: string;
  flight_number: string;
  nomor_tiket: string;
  kelas_kabin: string;
  pnr: string;
  status_penerimaan: StatusKlaim;
  timestamp: string;
}

interface ClaimMissingMilesProps {
  emailMember?: string;
}

// Static Reference Data

const MASKAPAI_OPTIONS = [
  { kode: 'GA', nama: 'Garuda Indonesia' },
  { kode: 'SQ', nama: 'Singapore Airlines' },
  { kode: 'JL', nama: 'Japan Airlines' },
  { kode: 'EK', nama: 'Emirates' },
  { kode: 'LH', nama: 'Lufthansa' },
  { kode: 'DL', nama: 'Delta' },
  { kode: 'AN', nama: 'All Nippon Airways' },
  { kode: 'CP', nama: 'Cathay Pacific' },
];

const BANDARA_OPTIONS = [
  { iata: 'CGK', nama: 'Soekarno-Hatta', kota: 'Jakarta' },
  { iata: 'SIN', nama: 'Changi Airport', kota: 'Singapore' },
  { iata: 'HND', nama: 'Haneda Airport', kota: 'Tokyo' },
  { iata: 'DXB', nama: 'Dubai International', kota: 'Dubai' },
  { iata: 'FRA', nama: 'Frankfurt Airport', kota: 'Frankfurt' },
  { iata: 'DPS', nama: 'Ngurah Rai', kota: 'Bali' },
  { iata: 'SUB', nama: 'Juanda International', kota: 'Surabaya' },
  { iata: 'KUL', nama: 'Kuala Lumpur Intl', kota: 'Kuala Lumpur' },
  { iata: 'ICN', nama: 'Incheon International', kota: 'Seoul' },
  { iata: 'SYD', nama: 'Sydney Airport', kota: 'Sydney' },
  { iata: 'LHR', nama: 'Heathrow Airport', kota: 'London' },
  { iata: 'CDG', nama: 'Charles de Gaulle', kota: 'Paris' },
  { iata: 'JFK', nama: 'John F. Kennedy Intl', kota: 'New York' },
  { iata: 'HKG', nama: 'Hong Kong International', kota: 'Hong Kong' },
  { iata: 'BKK', nama: 'Suvarnabhumi Airport', kota: 'Bangkok' },
];

const KELAS_KABIN_OPTIONS = ['Economy', 'Premium Economy', 'Business', 'First'];

// Mock Data

const MOCK_KLAIM: Klaim[] = [
  {
    id: 1,
    nomor_klaim: 'CLM-001',
    email_member: 'user1@mail.com',
    maskapai: 'GA',
    bandara_asal: 'CGK',
    bandara_tujuan: 'DPS',
    tanggal_penerbangan: '2024-10-01',
    flight_number: 'GA404',
    nomor_tiket: '126001',
    kelas_kabin: 'Business',
    pnr: 'ABC123',
    status_penerimaan: 'Disetujui',
    timestamp: '2024-10-05 18:45:00',
  },
  {
    id: 2,
    nomor_klaim: 'CLM-002',
    email_member: 'user1@mail.com',
    maskapai: 'SQ',
    bandara_asal: 'SIN',
    bandara_tujuan: 'HND',
    tanggal_penerbangan: '2024-11-15',
    flight_number: 'SQ12',
    nomor_tiket: 'TKT-002',
    kelas_kabin: 'Economy',
    pnr: 'DEF456',
    status_penerimaan: 'Menunggu',
    timestamp: '2024-11-20 18:45:00',
  },
];

// Helpers

function labelBandara(iata: string) {
  const b = BANDARA_OPTIONS.find(x => x.iata === iata);
  return b ? `${iata} - ${b.nama}, ${b.kota}` : iata;
}

function labelBandaraShort(iata: string) {
  const b = BANDARA_OPTIONS.find(x => x.iata === iata);
  return b ? `${iata}` : iata;
}

function labelMaskapai(kode: string) {
  const m = MASKAPAI_OPTIONS.find(x => x.kode === kode);
  return m ? `${kode} - ${m.nama}` : kode;
}

function nextNomorKlaim(list: Klaim[]) {
  const nums = list.map(k => parseInt(k.nomor_klaim.replace('CLM-', ''), 10));
  const max = nums.length ? Math.max(...nums) : 0;
  return `CLM-${String(max + 1).padStart(3, '0')}`;
}

function nowTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Status Badge

function StatusBadge({ status }: { status: StatusKlaim }) {
  const styles: Record<StatusKlaim, React.CSSProperties> = {
    Disetujui: { backgroundColor: '#22c55e', color: '#fff' },
    Menunggu:  { backgroundColor: '#f59e0b', color: '#fff' },
    Ditolak:   { backgroundColor: '#ef4444', color: '#fff' },
  };
  return (
    <span style={{
      ...styles[status],
      padding: '3px 10px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

// Form Fields

type FormState = {
  maskapai: string;
  kelas_kabin: string;
  bandara_asal: string;
  bandara_tujuan: string;
  tanggal_penerbangan: string;
  flight_number: string;
  nomor_tiket: string;
  pnr: string;
};

const EMPTY_FORM: FormState = {
  maskapai: 'GA',
  kelas_kabin: 'Economy',
  bandara_asal: 'CGK',
  bandara_tujuan: 'SIN',
  tanggal_penerbangan: '',
  flight_number: '',
  nomor_tiket: '',
  pnr: '',
};

// Klaim Form Modal

function KlaimFormModal({
  mode,
  initialValues,
  existingKlaims,
  onSubmit,
  onClose,
}: {
  mode: 'tambah' | 'edit';
  initialValues: FormState;
  existingKlaims: Klaim[];
  onSubmit: (data: FormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialValues);
  const [error, setError] = useState('');

  const set = (field: keyof FormState, val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = () => {
    setError('');
    if (!form.tanggal_penerbangan) { setError('Tanggal penerbangan wajib diisi.'); return; }
    if (!form.flight_number.trim()) { setError('Flight number wajib diisi.'); return; }
    if (!form.nomor_tiket.trim()) { setError('Nomor tiket wajib diisi.'); return; }
    if (!form.pnr.trim()) { setError('PNR wajib diisi.'); return; }
    if (form.bandara_asal === form.bandara_tujuan) { setError('Bandara asal dan tujuan tidak boleh sama.'); return; }

    // Cek duplikat
    if (mode === 'tambah') {
      const duplikat = existingKlaims.find(
        k => k.flight_number === form.flight_number &&
             k.tanggal_penerbangan === form.tanggal_penerbangan &&
             k.nomor_tiket === form.nomor_tiket
      );
      if (duplikat) {
        setError('Klaim duplikat: kombinasi flight number, tanggal, dan nomor tiket sudah pernah diajukan.');
        return;
      }
    }

    onSubmit(form);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            {mode === 'tambah' ? 'Ajukan Klaim Baru' : 'Edit Klaim'}
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        {/* Form Grid */}
        <div style={formGridStyle}>

          {/* Maskapai */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Maskapai</label>
            <select className="form-control" style={inputSm} value={form.maskapai} onChange={e => set('maskapai', e.target.value)}>
              {MASKAPAI_OPTIONS.map(m => (
                <option key={m.kode} value={m.kode}>{m.kode} - {m.nama}</option>
              ))}
            </select>
          </div>

          {/* Kelas Kabin */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Kelas Kabin</label>
            <select className="form-control" style={inputSm} value={form.kelas_kabin} onChange={e => set('kelas_kabin', e.target.value)}>
              {KELAS_KABIN_OPTIONS.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Bandara Asal */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bandara Asal</label>
            <select className="form-control" style={inputSm} value={form.bandara_asal} onChange={e => set('bandara_asal', e.target.value)}>
              {BANDARA_OPTIONS.map(b => (
                <option key={b.iata} value={b.iata}>{b.iata} - {b.nama}, {b.kota}</option>
              ))}
            </select>
          </div>

          {/* Bandara Tujuan */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bandara Tujuan</label>
            <select className="form-control" style={inputSm} value={form.bandara_tujuan} onChange={e => set('bandara_tujuan', e.target.value)}>
              {BANDARA_OPTIONS.map(b => (
                <option key={b.iata} value={b.iata}>{b.iata} - {b.nama}, {b.kota}</option>
              ))}
            </select>
          </div>

          {/* Tanggal Penerbangan */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Tanggal Penerbangan</label>
            <input type="date" className="form-control" style={inputSm} value={form.tanggal_penerbangan}
              onChange={e => set('tanggal_penerbangan', e.target.value)} />
          </div>

          {/* Flight Number */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Flight Number</label>
            <input type="text" className="form-control" style={inputSm} value={form.flight_number}
              onChange={e => set('flight_number', e.target.value.toUpperCase())}
              placeholder="cth: GA404" />
          </div>

          {/* Nomor Tiket */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nomor Tiket</label>
            <input type="text" className="form-control" style={inputSm} value={form.nomor_tiket}
              onChange={e => set('nomor_tiket', e.target.value)}
              placeholder="cth: 0011223345" />
          </div>

          {/* PNR */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>PNR</label>
            <input type="text" className="form-control" style={inputSm} value={form.pnr}
              onChange={e => set('pnr', e.target.value.toUpperCase())}
              placeholder="cth: P52DKC" />
          </div>

        </div>

        {error && <div style={{ ...errorBannerStyle, marginTop: 16 }}>{error}</div>}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn-primary" style={{ marginTop: 0 }} onClick={handleSubmit}>
            {mode === 'tambah' ? 'Ajukan' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Confirm Delete Modal

function ConfirmDeleteModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={{ ...modalStyle, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ ...modalTitleStyle, marginBottom: 8 }}>Batalkan Klaim?</h3>
        <p style={{ color: 'var(--white-800)', fontSize: 14, margin: '0 0 24px' }}>
          Klaim akan dihapus secara permanen.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button onClick={onConfirm} className="btn-primary" style={{ marginTop: 0, backgroundColor: '#ef4444' }}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component

type FilterStatus = 'Semua' | StatusKlaim;

export default function ClaimMissingMiles({ emailMember = 'user1@mail.com' }: ClaimMissingMilesProps) {
  const [klaims, setKlaims] = useState<Klaim[]>(MOCK_KLAIM);
  const [filter, setFilter] = useState<FilterStatus>('Semua');

  const [showTambah, setShowTambah] = useState(false);
  const [editTarget, setEditTarget] = useState<Klaim | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Klaim | null>(null);

  // Filter berdasarkan status
  const filtered = filter === 'Semua'
    ? klaims
    : klaims.filter(k => k.status_penerimaan === filter);

  // Handlers

  const handleTambah = (data: FormState) => {
    const newKlaim: Klaim = {
      id: Date.now(),
      nomor_klaim: nextNomorKlaim(klaims),
      email_member: emailMember,
      ...data,
      status_penerimaan: 'Menunggu',
      timestamp: nowTimestamp(),
    };
    // TODO: POST /api/claim-missing-miles
    setKlaims(prev => [...prev, newKlaim]);
    setShowTambah(false);
  };

  const handleEdit = (data: FormState) => {
    if (!editTarget) return;
    setKlaims(prev => prev.map(k =>
      k.id === editTarget.id ? { ...k, ...data } : k
    ));
    // TODO: PUT /api/claim-missing-miles/:id
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setKlaims(prev => prev.filter(k => k.id !== deleteTarget.id));
    // TODO: DELETE /api/claim-missing-miles/:id
    setDeleteTarget(null);
  };

  const filterTabs: FilterStatus[] = ['Semua', 'Menunggu', 'Disetujui', 'Ditolak'];

  return (
    <div className="page-container" style={{ maxWidth: 1000, textAlign: 'left' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Klaim Missing Miles
        </h1>
        <button
          className="btn-primary"
          style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => setShowTambah(true)}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Ajukan Klaim
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: filter === tab ? 'var(--primary-800)' : '#e5e7eb',
              color: filter === tab ? '#fff' : 'var(--white-900)',
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div style={{ background: 'var(--white-50)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['No. Klaim', 'Maskapai', 'Rute', 'Tanggal', 'Flight', 'Kelas', 'Status', 'Tanggal Pengajuan', 'Aksi'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--white-800)', fontSize: 14 }}>
                    Belum ada klaim{filter !== 'Semua' ? ` dengan status "${filter}"` : ''}.
                  </td>
                </tr>
              ) : (
                filtered.map((k, i) => (
                  <tr key={k.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'transparent' : '#fafafa' }}>
                    <td style={tdStyle}><strong>{k.nomor_klaim}</strong></td>
                    <td style={tdStyle}>{k.maskapai}</td>
                    <td style={tdStyle}>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {labelBandaraShort(k.bandara_asal)} → {labelBandaraShort(k.bandara_tujuan)}
                      </span>
                    </td>
                    <td style={tdStyle}>{k.tanggal_penerbangan}</td>
                    <td style={tdStyle}>{k.flight_number}</td>
                    <td style={tdStyle}>{k.kelas_kabin}</td>
                    <td style={tdStyle}><StatusBadge status={k.status_penerimaan} /></td>
                    <td style={tdStyle}>{k.timestamp}</td>
                    <td style={tdStyle}>
                      {k.status_penerimaan === 'Menunggu' ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {/* Edit */}
                          <button
                            onClick={() => setEditTarget(k)}
                            title="Edit klaim"
                            style={iconButtonStyle}
                          >
                            ✏️
                          </button>
                          {/* Hapus */}
                          <button
                            onClick={() => setDeleteTarget(k)}
                            title="Batalkan klaim"
                            style={{ ...iconButtonStyle, color: '#ef4444' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#ccc', fontSize: 12 }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showTambah && (
        <KlaimFormModal
          mode="tambah"
          initialValues={EMPTY_FORM}
          existingKlaims={klaims}
          onSubmit={handleTambah}
          onClose={() => setShowTambah(false)}
        />
      )}

      {editTarget && (
        <KlaimFormModal
          mode="edit"
          initialValues={{
            maskapai: editTarget.maskapai,
            kelas_kabin: editTarget.kelas_kabin,
            bandara_asal: editTarget.bandara_asal,
            bandara_tujuan: editTarget.bandara_tujuan,
            tanggal_penerbangan: editTarget.tanggal_penerbangan,
            flight_number: editTarget.flight_number,
            nomor_tiket: editTarget.nomor_tiket,
            pnr: editTarget.pnr,
          }}
          existingKlaims={klaims.filter(k => k.id !== editTarget.id)}
          onSubmit={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// Styles 
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: 20,
  fontFamily: "'Inter', sans-serif",
};

const modalStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '28px',
  width: '100%',
  maxWidth: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  boxSizing: 'border-box',
  boxShadow: '0 10px 30px rgba(77,111,224,0.08)',
  border: '1px solid #e2eaff',
  fontFamily: "'Inter', sans-serif",
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
};

const modalTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: 'var(--white-950)',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 24,
  cursor: 'pointer',
  color: 'var(--white-800)',
  lineHeight: 1,
  padding: '0 4px',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const inputSm: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 13,
  minWidth: 0,      
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  fontFamily: "'Inter', sans-serif",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--white-900)',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #6a90f0, #4d6fe0)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(77,111,224,0.35)',
  fontFamily: "'Inter', sans-serif",
  width: '100%',
  marginTop: '12px',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: '12px',
  background: 'transparent',
  color: '#4a5578',
  fontSize: '14px',
  fontWeight: 700,
  border: '1.5px solid #d0d8ef',
  cursor: 'pointer',
  fontFamily: "'Inter', sans-serif",
  width: '100%',
  marginTop: '8px',
};

const errorBannerStyle: React.CSSProperties = {
  backgroundColor: '#fff0f0',
  border: '1px solid #ffcccc',
  color: '#c00',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
};

const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary-800)',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '13px 16px',
  color: 'var(--white-900)',
  verticalAlign: 'middle',
  fontSize: 13,
};

const iconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 16,
  padding: '4px 6px',
  borderRadius: 6,
  lineHeight: 1,
  transition: 'background 0.2s',
};