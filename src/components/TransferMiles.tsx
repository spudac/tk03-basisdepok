import { useState } from 'react';

// Types

type TipeTransfer = 'Kirim' | 'Terima';

interface Transfer {
  id: number;
  timestamp: string;
  nama_member: string;
  email_member: string;
  jumlah_miles: number; 
  catatan: string;
  tipe: TipeTransfer;
}

interface TransferMilesProps {
  emailMember?: string;
  awardMilesAwal?: number;
}

// Mock Data

const MOCK_TRANSFERS: Transfer[] = [
  {
    id: 1,
    timestamp: '2025-01-15 10:30',
    nama_member: 'Jane Smith',
    email_member: 'jane@example.com',
    jumlah_miles: 5000,
    catatan: 'Hadiah ulang tahun',
    tipe: 'Kirim',
  },
  {
    id: 2,
    timestamp: '2025-02-01 14:00',
    nama_member: 'Budi A. Santoso',
    email_member: 'budi@example.com',
    jumlah_miles: 2000,
    catatan: '',
    tipe: 'Terima',
  },
];

// Simulasi daftar member aktif di sistem
const MOCK_MEMBER_EMAILS = [
  'jane@example.com',
  'budi@example.com',
  'john@example.com',
  'sari@example.com',
];

// Transfer Form Modal

function TransferModal({
  emailMember,
  awardMiles,
  onSubmit,
  onClose,
}: {
  emailMember: string;
  awardMiles: number;
  onSubmit: (email: string, jumlah: number, catatan: string) => void;
  onClose: () => void;
}) {
  const [emailPenerima, setEmailPenerima] = useState('');
  const [jumlah, setJumlah] = useState<number | ''>('');
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = () => {
    setError('');

    if (!emailPenerima.trim()) { setError('Email penerima wajib diisi.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPenerima)) { setError('Format email tidak valid.'); return; }
    if (emailPenerima.toLowerCase() === emailMember.toLowerCase()) { setError('Tidak dapat mentransfer miles ke diri sendiri.'); return; }
    if (!MOCK_MEMBER_EMAILS.includes(emailPenerima.toLowerCase())) { setError('Email penerima tidak terdaftar sebagai Member aktif.'); return; }
    if (!jumlah || jumlah <= 0) { setError('Jumlah miles harus lebih dari 0.'); return; }
    if (jumlah > awardMiles) { setError(`Award miles tidak mencukupi. Miles tersedia: ${awardMiles.toLocaleString()}.`); return; }

    onSubmit(emailPenerima, jumlah as number, catatan);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>Transfer Miles</h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Email Penerima</label>
            <input
              type="email"
              className="form-control"
              value={emailPenerima}
              onChange={e => { setEmailPenerima(e.target.value); setError(''); }}
              placeholder="cth: johnlennon@gmail.com"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Jumlah Miles</label>
            <input
              type="number"
              className="form-control"
              value={jumlah}
              min={1}
              max={awardMiles}
              onChange={e => { setJumlah(e.target.value === '' ? '' : Number(e.target.value)); setError(''); }}
              placeholder={`Maks. ${awardMiles.toLocaleString()}`}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Catatan (opsional)</label>
            <textarea
              className="form-control"
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="cth: Hadiah ulang tahun"
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {error && <div style={errorBannerStyle}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn-primary" style={{ marginTop: 0 }} onClick={handleTransfer}>
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component

export default function TransferMiles({
  emailMember = 'user1@mail.com',
  awardMilesAwal = 32000,
}: TransferMilesProps) {
  const [transfers, setTransfers] = useState<Transfer[]>(MOCK_TRANSFERS);
  const [awardMiles, setAwardMiles] = useState(awardMilesAwal);
  const [showModal, setShowModal] = useState(false);

  function nowTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 16);
  }

  const handleSubmit = (emailPenerima: string, jumlah: number, catatan: string) => {
    // Simulasi nama penerima dari email
    const namaPenerima = emailPenerima.split('@')[0]
      .replace(/\./g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const newTransfer: Transfer = {
      id: Date.now(),
      timestamp: nowTimestamp(),
      nama_member: namaPenerima,
      email_member: emailPenerima,
      jumlah_miles: jumlah,
      catatan,
      tipe: 'Kirim',
    };

    // TODO: POST /api/transfer-miles
    setTransfers(prev => [newTransfer, ...prev]);
    setAwardMiles(prev => prev - jumlah);
    setShowModal(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: 900, textAlign: 'left' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>
            Transfer Miles
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--white-800)' }}>
            Award Miles tersedia:{' '}
            <strong style={{ color: 'var(--white-950)' }}>
              {awardMiles.toLocaleString('id-ID')}
            </strong>
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => setShowModal(true)}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Transfer Baru
        </button>
      </div>

      {/* Tabel Riwayat */}
      <div style={{ background: 'var(--white-50)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>
            Riwayat Transfer
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['Waktu', 'Member', 'Jumlah Miles', 'Catatan', 'Tipe', 'Aksi'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--white-800)', fontSize: 14 }}>
                    Belum ada riwayat transfer.
                  </td>
                </tr>
              ) : (
                transfers.map((t, i) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'transparent' : '#fafafa' }}>

                    <td style={tdStyle}>{t.timestamp}</td>

                    {/* Member: nama + email */}
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{t.nama_member}</div>
                      <div style={{ fontSize: 12, color: 'var(--white-800)' }}>{t.email_member}</div>
                    </td>

                    {/* Jumlah: merah minus untuk Kirim, hijau plus untuk Terima */}
                    <td style={tdStyle}>
                      <span style={{
                        fontWeight: 700,
                        color: t.tipe === 'Kirim' ? '#ef4444' : '#22c55e',
                      }}>
                        {t.tipe === 'Kirim' ? '-' : '+'}{t.jumlah_miles.toLocaleString('id-ID')}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {t.catatan || <span style={{ color: 'var(--white-800)' }}>-</span>}
                    </td>

                    {/* Tipe badge */}
                    <td style={tdStyle}>
                      {t.tipe === 'Terima' ? (
                        <span style={{
                          backgroundColor: 'var(--primary-800)',
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 700,
                        }}>
                          Terima
                        </span>
                      ) : (
                        <span style={{
                          backgroundColor: 'white',
                          color: '#111',
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 700,
                          border: '1.5px solid #111',
                        }}>
                          Kirim
                        </span>
                      )}
                    </td>

                    {/* Aksi: ikon cetak/detail (tidak bisa edit/hapus) */}
                    <td style={tdStyle}>
                      <button
                        title="Lihat detail"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'default',
                          fontSize: 16,
                          color: 'var(--white-800)',
                          opacity: 0.5,
                        }}
                      >
                        🔒
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <TransferModal
          emailMember={emailMember}
          awardMiles={awardMiles}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
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
  maxWidth: 420,
  boxShadow: '0 10px 30px rgba(77,111,224,0.08)',
  border: '1px solid #e2eaff',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
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
  fontSize: 22,
  cursor: 'pointer',
  color: 'var(--white-800)',
  lineHeight: 1,
  padding: '0 4px',
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--white-900)',
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
  flex: 1,
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
  flex: 1,
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