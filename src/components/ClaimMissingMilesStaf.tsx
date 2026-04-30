import { useState } from 'react';
import './Fitur.css';

// Types

type StatusKlaim = 'Menunggu' | 'Disetujui' | 'Ditolak';

interface Klaim {
  id: number;
  nomor_klaim: string;
  email_member: string;
  nama_member: string;
  email_staf: string | null;
  maskapai: string;
  bandara_asal: string;
  bandara_tujuan: string;
  tanggal_penerbangan: string;
  flight_number: string;
  kelas_kabin: string;
  timestamp: string;
  status_penerimaan: StatusKlaim;
}

interface ClaimMissingMilesStafProps {
  emailStaf?: string;
}

// Static Reference Data

const MASKAPAI_OPTIONS = [
  { kode: 'GA', nama: 'Garuda Indonesia' },
  { kode: 'SQ', nama: 'Singapore Airlines' },
  { kode: 'JL', nama: 'Japan Airlines' },
  { kode: 'EK', nama: 'Emirates' },
  { kode: 'LH', nama: 'Lufthansa' },
  { kode: 'MH', nama: 'Malaysia Airlines' },
];

// Mock Data

const MOCK_KLAIM: Klaim[] = [
  {
    id: 1, nomor_klaim: 'CLM-001',
    email_member: 'john@example.com', nama_member: 'John W. Doe',
    email_staf: 'staff1@aero.com',
    maskapai: 'GA', bandara_asal: 'CGK', bandara_tujuan: 'DPS',
    tanggal_penerbangan: '2024-10-01', flight_number: 'GA404',
    kelas_kabin: 'Business', timestamp: '2024-10-05 18:45:00',
    status_penerimaan: 'Disetujui',
  },
  {
    id: 2, nomor_klaim: 'CLM-002',
    email_member: 'john@example.com', nama_member: 'John W. Doe',
    email_staf: null,
    maskapai: 'SQ', bandara_asal: 'SIN', bandara_tujuan: 'NRT',
    tanggal_penerbangan: '2024-11-15', flight_number: 'SQ12',
    kelas_kabin: 'Economy', timestamp: '2024-11-20 18:45:00',
    status_penerimaan: 'Menunggu',
  },
  {
    id: 3, nomor_klaim: 'CLM-003',
    email_member: 'jane@example.com', nama_member: 'Jane Smith',
    email_staf: 'staff1@aero.com',
    maskapai: 'GA', bandara_asal: 'CGK', bandara_tujuan: 'SUB',
    tanggal_penerbangan: '2024-12-01', flight_number: 'GA310',
    kelas_kabin: 'Economy', timestamp: '2024-12-05 18:45:00',
    status_penerimaan: 'Ditolak',
  },
  {
    id: 4, nomor_klaim: 'CLM-004',
    email_member: 'budi@example.com', nama_member: 'Budi A. Santoso',
    email_staf: null,
    maskapai: 'MH', bandara_asal: 'KUL', bandara_tujuan: 'BKK',
    tanggal_penerbangan: '2025-01-10', flight_number: 'MH780',
    kelas_kabin: 'Premium Economy', timestamp: '2025-01-15 18:45:00',
    status_penerimaan: 'Menunggu',
  },
];

// Helpers

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

// Modal Setujui

function SetujuiModal({
  klaim,
  onConfirm,
  onClose,
}: {
  klaim: Klaim;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>Setujui Klaim</h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
        <p style={modalSubStyle}>
          Miles akan ditambahkan ke akun member sesuai rute dan kelas kabin.
        </p>
        <div style={modalInfoStyle}>
          <p>Klaim: <strong>{klaim.nomor_klaim}</strong></p>
          <p>Member: <strong>{klaim.nama_member}</strong></p>
          <p>Rute: <strong>{klaim.bandara_asal} → {klaim.bandara_tujuan}</strong></p>
          <p>Kelas: <strong>{klaim.kelas_kabin}</strong></p>
        </div>
        <div style={modalFooterStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button onClick={onConfirm} className="btn-primary" style={{ marginTop: 0 }}>
            Setujui
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal Tolak

function TolakModal({
  klaim,
  onConfirm,
  onClose,
}: {
  klaim: Klaim;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={{ ...modalTitleStyle }}>Tolak Klaim</h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
        <p style={modalSubStyle}>
          Klaim akan ditolak dan member akan diinformasikan.
        </p>
        <div style={modalInfoStyle}>
          <p>Klaim: <strong>{klaim.nomor_klaim}</strong></p>
          <p>Member: <strong>{klaim.nama_member}</strong></p>
          <p>Rute: <strong>{klaim.bandara_asal} → {klaim.bandara_tujuan}</strong></p>
          <p>Kelas: <strong>{klaim.kelas_kabin}</strong></p>
        </div>
        <div style={modalFooterStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button
            onClick={onConfirm}
            className="btn-primary"
            style={{ marginTop: 0, backgroundColor: '#ef4444' }}
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component

type FilterStatus = 'Semua Status' | StatusKlaim;
type FilterMaskapai = 'Semua Maskapai' | string;

export default function ClaimMissingMilesStaf({
  emailStaf = 'staff1@aero.com',
}: ClaimMissingMilesStafProps) {
  const [klaims, setKlaims] = useState<Klaim[]>(MOCK_KLAIM);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Semua Status');
  const [filterMaskapai, setFilterMaskapai] = useState<FilterMaskapai>('Semua Maskapai');
  const [filterTanggalDari, setFilterTanggalDari] = useState('');
  const [filterTanggalSampai, setFilterTanggalSampai] = useState('');

  const [setujuiTarget, setSetujuiTarget] = useState<Klaim | null>(null);
  const [tolakTarget, setTolakTarget] = useState<Klaim | null>(null);

  // Filter logic
  const filtered = klaims.filter(k => {
    if (filterStatus !== 'Semua Status' && k.status_penerimaan !== filterStatus) return false;
    if (filterMaskapai !== 'Semua Maskapai' && k.maskapai !== filterMaskapai) return false;
    if (filterTanggalDari && k.timestamp.slice(0, 10) < filterTanggalDari) return false;
    if (filterTanggalSampai && k.timestamp.slice(0, 10) > filterTanggalSampai) return false;
    return true;
  });

  // Handlers
  const handleSetujui = () => {
    if (!setujuiTarget) return;
    setKlaims(prev => prev.map(k =>
      k.id === setujuiTarget.id
        ? { ...k, status_penerimaan: 'Disetujui', email_staf: emailStaf }
        : k
    ));
    // TODO: PUT /api/claim-missing-miles/:id/setujui
    setSetujuiTarget(null);
  };

  const handleTolak = () => {
    if (!tolakTarget) return;
    setKlaims(prev => prev.map(k =>
      k.id === tolakTarget.id
        ? { ...k, status_penerimaan: 'Ditolak', email_staf: emailStaf }
        : k
    ));
    // TODO: PUT /api/claim-missing-miles/:id/tolak
    setTolakTarget(null);
  };

  return (
    <div className="page-container" style={{ maxWidth: 1100, textAlign: 'left' }}>

      {/* Header */}
      <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>
        Kelola Klaim Missing Miles
      </h1>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Filter Status */}
        <select
          style={filterSelectStyle}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as FilterStatus)}
        >
          <option value="Semua Status">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>

        {/* Filter Maskapai */}
        <select
          style={filterSelectStyle}
          value={filterMaskapai}
          onChange={e => setFilterMaskapai(e.target.value)}
        >
          <option value="Semua Maskapai">Semua Maskapai</option>
          {MASKAPAI_OPTIONS.map(m => (
            <option key={m.kode} value={m.kode}>{m.kode} - {m.nama}</option>
          ))}
        </select>

        {/* Filter Tanggal Pengajuan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--white-800)', whiteSpace: 'nowrap' }}>Tanggal Pengajuan</span>
          <input
            type="date"
            style={filterSelectStyle}
            value={filterTanggalDari}
            onChange={e => setFilterTanggalDari(e.target.value)}
            title="Dari tanggal"
          />
          <span style={{ fontSize: 13, color: 'var(--white-800)' }}>—</span>
          <input
            type="date"
            style={filterSelectStyle}
            value={filterTanggalSampai}
            onChange={e => setFilterTanggalSampai(e.target.value)}
            title="Sampai tanggal"
          />
          {(filterTanggalDari || filterTanggalSampai) && (
            <button
              onClick={() => { setFilterTanggalDari(''); setFilterTanggalSampai(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-800)', fontSize: 13 }}
            >
              ✕ Reset
            </button>
          )}
        </div>
      </div>

      {/* Tabel */}
      <div style={{ background: 'var(--white-50)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['No. Klaim', 'Member', 'Maskapai', 'Rute', 'Tanggal', 'Flight', 'Kelas', 'Tanggal Pengajuan', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--white-800)', fontSize: 14 }}>
                    Tidak ada klaim yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((k, i) => (
                  <tr
                    key={k.id}
                    style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'transparent' : '#fafafa' }}
                  >
                    <td style={tdStyle}><strong>{k.nomor_klaim}</strong></td>

                    {/* Member: nama + email*/}
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{k.nama_member}</div>
                      <div style={{ fontSize: 12, color: 'var(--white-800)' }}>{k.email_member}</div>
                    </td>

                    <td style={tdStyle}>{k.maskapai}</td>
                    <td style={tdStyle}>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {k.bandara_asal} → {k.bandara_tujuan}
                      </span>
                    </td>
                    <td style={tdStyle}>{k.tanggal_penerbangan}</td>
                    <td style={tdStyle}>{k.flight_number}</td>
                    <td style={tdStyle}>{k.kelas_kabin}</td>
                    <td style={tdStyle}>{k.timestamp}</td>
                    <td style={tdStyle}><StatusBadge status={k.status_penerimaan} /></td>

                    {/* hanya untuk Menunggu */}
                    <td style={tdStyle}>
                      {k.status_penerimaan === 'Menunggu' ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          {/* Tombol Setujui */}
                          <button
                            onClick={() => setSetujuiTarget(k)}
                            title="Setujui klaim"
                            style={actionButtonStyle('#22c55e')}
                          >
                            ✓
                          </button>
                          {/* Tombol Tolak */}
                          <button
                            onClick={() => setTolakTarget(k)}
                            title="Tolak klaim"
                            style={actionButtonStyle('#ef4444')}
                          >
                            ✕
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
      {setujuiTarget && (
        <SetujuiModal
          klaim={setujuiTarget}
          onConfirm={handleSetujui}
          onClose={() => setSetujuiTarget(null)}
        />
      )}
      {tolakTarget && (
        <TolakModal
          klaim={tolakTarget}
          onConfirm={handleTolak}
          onClose={() => setTolakTarget(null)}
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
  maxWidth: 440,
  boxShadow: '0 10px 30px rgba(77,111,224,0.08)',
  border: '1px solid #e2eaff',
  fontFamily: "'Inter', sans-serif",
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
};

const modalTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: 'var(--white-950)',
};

const modalSubStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--white-800)',
  margin: '0 0 16px',
};

const modalInfoStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--white-900)',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 24,
};

const modalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 22,
  cursor: 'pointer',
  color: 'var(--white-800)',
  lineHeight: 1,
  padding: '0 4px',
};

const approveButtonStyle: React.CSSProperties = {
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
};

const filterSelectStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: 13,
  color: 'var(--white-900)',
  background: 'white',
  cursor: 'pointer',
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

const actionButtonStyle = (color: string): React.CSSProperties => ({
  width: 32,
  height: 32,
  borderRadius: '8px',
  border: `1.5px solid ${color}`,
  background: 'white',
  color: color,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  transition: 'all 0.2s',
});