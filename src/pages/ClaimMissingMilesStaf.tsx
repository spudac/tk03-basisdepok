import { useState, useEffect } from 'react';
import '@components/Fitur.css';
import { supabase } from '@/supabase';
 
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
 
interface MaskapaiOption { kode_maskapai: string; nama_maskapai: string; }
 
interface ClaimMissingMilesStafProps { emailStaf?: string; }
 
// Helpers
 
function StatusBadge({ status }: { status: StatusKlaim }) {
  const styles: Record<StatusKlaim, React.CSSProperties> = {
    Disetujui: { backgroundColor: '#22c55e', color: '#fff' },
    Menunggu:  { backgroundColor: '#f59e0b', color: '#fff' },
    Ditolak:   { backgroundColor: '#ef4444', color: '#fff' },
  };
  return (
    <span style={{ ...styles[status], padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}
 
// Modals
 
function SetujuiModal({ klaim, onConfirm, onClose }: { klaim: Klaim; onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>Setujui Klaim</h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
        <p style={modalSubStyle}>Miles akan ditambahkan ke akun member sesuai rute dan kelas kabin.</p>
        <div style={modalInfoStyle}>
          <p>Klaim: <strong>{klaim.nomor_klaim}</strong></p>
          <p>Member: <strong>{klaim.nama_member}</strong></p>
          <p>Rute: <strong>{klaim.bandara_asal} → {klaim.bandara_tujuan}</strong></p>
          <p>Kelas: <strong>{klaim.kelas_kabin}</strong></p>
        </div>
        <div style={modalFooterStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button onClick={onConfirm} className="btn-primary" style={{ marginTop: 0 }}>Setujui</button>
        </div>
      </div>
    </div>
  );
}
 
function TolakModal({ klaim, onConfirm, onClose }: { klaim: Klaim; onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>Tolak Klaim</h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
        <p style={modalSubStyle}>Klaim akan ditolak dan member akan diinformasikan.</p>
        <div style={modalInfoStyle}>
          <p>Klaim: <strong>{klaim.nomor_klaim}</strong></p>
          <p>Member: <strong>{klaim.nama_member}</strong></p>
          <p>Rute: <strong>{klaim.bandara_asal} → {klaim.bandara_tujuan}</strong></p>
          <p>Kelas: <strong>{klaim.kelas_kabin}</strong></p>
        </div>
        <div style={modalFooterStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button onClick={onConfirm} className="btn-primary" style={{ marginTop: 0, backgroundColor: '#ef4444' }}>Tolak</button>
        </div>
      </div>
    </div>
  );
}
 
// Main Component
 
type FilterStatus = 'Semua Status' | StatusKlaim;
 
export default function ClaimMissingMilesStaf({ emailStaf }: ClaimMissingMilesStafProps) {
  const session        = JSON.parse(sessionStorage.getItem('aeromiles_user') ?? '{}');
  const resolvedStaf   = emailStaf ?? session.email ?? '';
 
  const [klaims,       setKlaims]       = useState<Klaim[]>([]);
  const [maskapaiList, setMaskapaiList] = useState<MaskapaiOption[]>([]); 
  const [loading,      setLoading]      = useState(true);
  const [toast,        setToast]        = useState({ visible: false, message: '', isError: false });
 
  // Filters
  const [filterStatus,        setFilterStatus]        = useState<FilterStatus>('Semua Status');
  const [filterMaskapai,      setFilterMaskapai]      = useState('Semua Maskapai');
  const [filterTanggalDari,   setFilterTanggalDari]   = useState('');
  const [filterTanggalSampai, setFilterTanggalSampai] = useState('');
 
  const [setujuiTarget, setSetujuiTarget] = useState<Klaim | null>(null);
  const [tolakTarget,   setTolakTarget]   = useState<Klaim | null>(null);
 
  const showToast = (message: string, isError = false) => {
    setToast({ visible: true, message, isError });
    setTimeout(() => setToast({ visible: false, message: '', isError: false }), 4000);
  };
 
  // Fetch maskapai list from DB
  useEffect(() => {
    supabase
      .from('maskapai')
      .select('kode_maskapai, nama_maskapai')
      .order('nama_maskapai')
      .then(({ data }) => { if (data) setMaskapaiList(data); });
  }, []);
 
  const fetchKlaims = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('claim_missing_miles')
      .select(`
        id, email_member, email_staf, maskapai,
        bandara_asal, bandara_tujuan, tanggal_penerbangan,
        flight_number, kelas_kabin, timestamp, status_penerimaan,
        member!claim_missing_miles_email_member_fkey (
          pengguna (
            first_mid_name, last_name
          )
        )
      `)
      .order('timestamp', { ascending: false });
 
    if (error) { console.error('fetchKlaims:', error.message); setLoading(false); return; }
 
    setKlaims((data ?? []).map((row: any) => ({
      id:                  row.id,
      nomor_klaim:         `CLM-${String(row.id).padStart(3, '0')}`,
      email_member:        row.email_member,
      nama_member: row.member?.pengguna
                    ? `${row.member.pengguna.first_mid_name} ${row.member.pengguna.last_name}`
                    : row.email_member,
      email_staf:          row.email_staf,
      maskapai:            row.maskapai,
      bandara_asal:        row.bandara_asal,
      bandara_tujuan:      row.bandara_tujuan,
      tanggal_penerbangan: row.tanggal_penerbangan,
      flight_number:       row.flight_number,
      kelas_kabin:         row.kelas_kabin,
      timestamp:           row.timestamp,
      status_penerimaan:   row.status_penerimaan as StatusKlaim,
    })));
    setLoading(false);
  };
 
  useEffect(() => { fetchKlaims(); }, []);
 
  const handleSetujui = async () => {
    if (!setujuiTarget) return;
    const { error } = await supabase
      .from('claim_missing_miles')
      .update({ status_penerimaan: 'Disetujui', email_staf: resolvedStaf })
      .eq('id', setujuiTarget.id)
      .eq('status_penerimaan', 'Menunggu');
 
    if (error) {
      showToast('Gagal menyetujui klaim: ' + error.message, true);
    } else {
      showToast(
        `SUKSES: Total miles Member "${setujuiTarget.email_member}" telah diperbarui. ` +
        `Miles ditambahkan: 1000 miles dari klaim penerbangan "${setujuiTarget.flight_number}".`
      );
      fetchKlaims();
    }
    setSetujuiTarget(null);
  };
 
  // Tolak
  const handleTolak = async () => {
    if (!tolakTarget) return;
    const { error } = await supabase
      .from('claim_missing_miles')
      .update({ status_penerimaan: 'Ditolak', email_staf: resolvedStaf })
      .eq('id', tolakTarget.id)
      .eq('status_penerimaan', 'Menunggu');
 
    if (error) {
      showToast('Gagal menolak klaim: ' + error.message, true);
    } else {
      showToast(`Klaim "${tolakTarget.nomor_klaim}" telah ditolak.`);
      fetchKlaims();
    }
    setTolakTarget(null);
  };
 
  const filtered = klaims.filter(k => {
    if (filterStatus !== 'Semua Status' && k.status_penerimaan !== filterStatus) return false;
    if (filterMaskapai !== 'Semua Maskapai' && k.maskapai !== filterMaskapai)    return false;
    if (filterTanggalDari   && k.timestamp.slice(0, 10) < filterTanggalDari)    return false;
    if (filterTanggalSampai && k.timestamp.slice(0, 10) > filterTanggalSampai)  return false;
    return true;
  });
 
  // Render
 
  return (
    <div className="page-container" style={{ maxWidth: 1100, textAlign: 'left', backgroundColor: 'transparent', margin: '0 auto', paddingTop: '24px' }}>

      {/* Header */}
      <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>
        Kelola Klaim Missing Miles
      </h1>
 
      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
 
        <select style={filterSelectStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value as FilterStatus)}>
          <option value="Semua Status">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
 
        {/* Maskapai filter*/}
        <select style={filterSelectStyle} value={filterMaskapai} onChange={e => setFilterMaskapai(e.target.value)}>
          <option value="Semua Maskapai">Semua Maskapai</option>
          {maskapaiList.map(m => (
            <option key={m.kode_maskapai} value={m.kode_maskapai}>
              {m.kode_maskapai} - {m.nama_maskapai}
            </option>
          ))}
        </select>
 
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--white-800)' }}>Dari</span>
          <input type="date" style={filterSelectStyle} value={filterTanggalDari} onChange={e => setFilterTanggalDari(e.target.value)} />
          <span style={{ fontSize: 13, color: 'var(--white-800)' }}>s/d</span>
          <input type="date" style={filterSelectStyle} value={filterTanggalSampai} onChange={e => setFilterTanggalSampai(e.target.value)} />
          {(filterTanggalDari || filterTanggalSampai) && (
            <button onClick={() => { setFilterTanggalDari(''); setFilterTanggalSampai(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-800)', fontSize: 13 }}>
              ✕ Reset
            </button>
          )}
        </div>
      </div>
 
      {/* Table */}
      <div style={{ background: 'var(--white-50)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--white-800)' }}>Memuat data...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['No. Klaim','Member','Maskapai','Rute','Tanggal','Flight','Kelas','Tanggal Pengajuan','Status','Aksi'].map(h => (
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
                ) : filtered.map((k, i) => (
                  <tr key={k.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'transparent' : '#fafafa' }}>
                    <td style={tdStyle}><strong>{k.nomor_klaim}</strong></td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{k.nama_member}</div>
                      <div style={{ fontSize: 12, color: 'var(--white-800)' }}>{k.email_member}</div>
                    </td>
                    <td style={tdStyle}>{k.maskapai}</td>
                    <td style={tdStyle}><span style={{ whiteSpace: 'nowrap' }}>{k.bandara_asal} → {k.bandara_tujuan}</span></td>
                    <td style={tdStyle}>{k.tanggal_penerbangan}</td>
                    <td style={tdStyle}>{k.flight_number}</td>
                    <td style={tdStyle}>{k.kelas_kabin}</td>
                    <td style={tdStyle}>{k.timestamp}</td>
                    <td style={tdStyle}><StatusBadge status={k.status_penerimaan} /></td>
                    <td style={tdStyle}>
                      {k.status_penerimaan === 'Menunggu' ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setSetujuiTarget(k)} title="Setujui" style={actionButtonStyle('#22c55e')}>✓</button>
                          <button onClick={() => setTolakTarget(k)}   title="Tolak"   style={actionButtonStyle('#ef4444')}>✕</button>
                        </div>
                      ) : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
 
      {setujuiTarget && <SetujuiModal klaim={setujuiTarget} onConfirm={handleSetujui} onClose={() => setSetujuiTarget(null)} />}
      {tolakTarget   && <TolakModal   klaim={tolakTarget}   onConfirm={handleTolak}   onClose={() => setTolakTarget(null)} />}
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