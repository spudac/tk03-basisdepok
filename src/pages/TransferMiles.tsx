import { useState, useEffect } from 'react';
import '@components/Fitur.css';
import { supabase } from '@/supabase';

type TipeTransfer = 'Kirim' | 'Terima';

interface Transfer {
  key: string;
  timestamp: string;
  other_email: string;
  other_name: string;
  jumlah: number;
  catatan: string | null;
  tipe: TipeTransfer;
}


async function fetchTransferHistory(userEmail: string): Promise<Transfer[]> {
  const [{ data: sent }, { data: received }] = await Promise.all([
    supabase
      .from('transfer')
      .select('email_member_1, email_member_2, timestamp, jumlah, catatan')
      .eq('email_member_1', userEmail)
      .order('timestamp', { ascending: false }),
    supabase
      .from('transfer')
      .select('email_member_1, email_member_2, timestamp, jumlah, catatan')
      .eq('email_member_2', userEmail)
      .order('timestamp', { ascending: false }),
  ]);


  const otherEmails = new Set<string>();
  (sent ?? []).forEach(r => otherEmails.add(r.email_member_2));
  (received ?? []).forEach(r => otherEmails.add(r.email_member_1));

  const nameMap: Record<string, string> = {};
  if (otherEmails.size > 0) {
    const { data: pengguna } = await supabase
      .from('pengguna')
      .select('email, first_mid_name, last_name')
      .in('email', Array.from(otherEmails));
    (pengguna ?? []).forEach(p => {
      nameMap[p.email] = `${p.first_mid_name} ${p.last_name}`.trim();
    });
  }

  const toTransfer = (
    row: { email_member_1: string; email_member_2: string; timestamp: string; jumlah: number; catatan: string | null },
    tipe: TipeTransfer
  ): Transfer => {
    const otherEmail = tipe === 'Kirim' ? row.email_member_2 : row.email_member_1;
    return {
      key: `${row.email_member_1}-${row.email_member_2}-${row.timestamp}`,
      timestamp: row.timestamp,
      other_email: otherEmail,
      other_name: nameMap[otherEmail] ?? otherEmail,
      jumlah: row.jumlah,
      catatan: row.catatan,
      tipe,
    };
  };

  const all = [
    ...(sent ?? []).map(r => toTransfer(r, 'Kirim')),
    ...(received ?? []).map(r => toTransfer(r, 'Terima')),
  ];


  all.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return all;
}



function TransferModal({
  userEmail,
  awardMiles,
  onSubmit,
  onClose,
}: {
  userEmail: string;
  awardMiles: number;
  onSubmit: (email: string, jumlah: number, catatan: string) => Promise<string | null>;
  onClose: () => void;
}) {
  const [emailPenerima, setEmailPenerima] = useState('');
  const [jumlah, setJumlah] = useState<number | ''>('');
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    setError('');

    if (!emailPenerima.trim()) { setError('Email penerima wajib diisi.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPenerima)) { setError('Format email tidak valid.'); return; }
    if (emailPenerima.toLowerCase() === userEmail.toLowerCase()) { setError('Tidak dapat mentransfer miles ke diri sendiri.'); return; }
    if (!jumlah || jumlah <= 0) { setError('Jumlah miles harus lebih dari 0.'); return; }
    if (jumlah > awardMiles) { setError(`Award miles tidak mencukupi. Miles tersedia: ${awardMiles.toLocaleString()}.`); return; }

    setLoading(true);
    const rpcError = await onSubmit(emailPenerima, jumlah as number, catatan);
    setLoading(false);

    if (rpcError) {
      setError(rpcError);
    }
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
              maxLength={255}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {error && <div style={errorBannerStyle}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            className="btn-primary"
            style={{ marginTop: 0, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            onClick={handleTransfer}
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function TransferMiles() {
  const session = JSON.parse(sessionStorage.getItem('aeromiles_user') ?? '{}');
  const userEmail: string = session.email ?? '';

  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [awardMiles, setAwardMiles] = useState<number>(session.award_miles ?? 0);
  const [showModal, setShowModal] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  async function loadHistory() {
    if (!userEmail) return;
    setLoadingHistory(true);
    const data = await fetchTransferHistory(userEmail);
    setTransfers(data);
    setLoadingHistory(false);
  }

  async function refreshAwardMiles() {
    if (!userEmail) return;
    const { data } = await supabase
      .from('member')
      .select('award_miles')
      .eq('email', userEmail)
      .single();
    if (data) {
      setAwardMiles(data.award_miles ?? 0);

      const stored = JSON.parse(sessionStorage.getItem('aeromiles_user') ?? '{}');
      sessionStorage.setItem('aeromiles_user', JSON.stringify({ ...stored, award_miles: data.award_miles }));
    }
  }

  useEffect(() => {
    loadHistory();
    refreshAwardMiles();

  }, [userEmail]);

  const handleSubmit = async (emailPenerima: string, jumlah: number, catatan: string): Promise<string | null> => {
    const { error } = await supabase.rpc('transfer_miles', {
      sender_email: userEmail,
      receiver_email: emailPenerima,
      transfer_amt: jumlah,
      notes: catatan.trim() === '' ? null : catatan,
    });

    if (error) return error.message;

    await Promise.all([loadHistory(), refreshAwardMiles()]);
    setShowModal(false);
    return null;
  };

  return (
    <div className="page-container" style={{ width: '100%', maxWidth: 1000, textAlign: 'left' }}>
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
                {['Waktu', 'Member', 'Jumlah Miles', 'Catatan', 'Tipe'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingHistory ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--white-800)', fontSize: 14 }}>
                    Memuat riwayat...
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--white-800)', fontSize: 14 }}>
                    Belum ada riwayat transfer.
                  </td>
                </tr>
              ) : (
                transfers.map((t, i) => (
                  <tr key={t.key} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'transparent' : '#fafafa' }}>

                    <td style={tdStyle}>{t.timestamp.replace('T', ' ').substring(0, 16)}</td>

                    {/* Member: nama + email */}
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{t.other_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--white-800)' }}>{t.other_email}</div>
                    </td>

                    {/* Jumlah: merah minus untuk Kirim, hijau plus untuk Terima */}
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: t.tipe === 'Kirim' ? '#ef4444' : '#22c55e' }}>
                        {t.tipe === 'Kirim' ? '-' : '+'}{t.jumlah.toLocaleString('id-ID')}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {t.catatan || <span style={{ color: 'var(--white-800)' }}>-</span>}
                    </td>

                    {/* Tipe badge */}
                    <td style={tdStyle}>
                      {t.tipe === 'Terima' ? (
                        <span style={{ backgroundColor: 'var(--primary-800)', color: 'white', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                          Terima
                        </span>
                      ) : (
                        <span style={{ backgroundColor: 'white', color: '#111', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, border: '1.5px solid #111' }}>
                          Kirim
                        </span>
                      )}
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
          userEmail={userEmail}
          awardMiles={awardMiles}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

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