import { useState, useEffect } from 'react';
import '@components/Fitur.css';
import { supabase } from '@/supabase';
 
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
interface MaskapaiOption  { kode_maskapai: string; nama_maskapai: string; }
interface BandaraOption   { iata_code: string; nama: string; kota: string; }
 
interface ClaimMissingMilesProps { emailMember?: string; }
 
const KELAS_KABIN_OPTIONS = ['Economy', 'Premium Economy', 'Business', 'First'];
 
// Helpers
 
function nowTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}
 
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
 
// Form State
 
type FormState = {
  maskapai: string; kelas_kabin: string; bandara_asal: string;
  bandara_tujuan: string; tanggal_penerbangan: string;
  flight_number: string; nomor_tiket: string; pnr: string;
};
 
function emptyForm(maskapaiList: MaskapaiOption[], bandaraList: BandaraOption[]): FormState {
  return {
    maskapai:            maskapaiList[0]?.kode_maskapai ?? '',
    kelas_kabin:         'Economy',
    bandara_asal:        bandaraList[0]?.iata_code ?? '',
    bandara_tujuan:      bandaraList[1]?.iata_code ?? '',
    tanggal_penerbangan: '',
    flight_number:       '',
    nomor_tiket:         '',
    pnr:                 '',
  };
}
 
// Klaim Form Modal
 
function KlaimFormModal({ mode, initialValues, existingKlaims, maskapaiList, bandaraList, onSubmit, onClose }: {
  mode: 'tambah' | 'edit';
  initialValues: FormState;
  existingKlaims: Klaim[];
  maskapaiList: MaskapaiOption[];
  bandaraList: BandaraOption[];
  onSubmit: (data: FormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialValues);
  const [error, setError] = useState('');
  const set = (field: keyof FormState, val: string) => setForm(prev => ({ ...prev, [field]: val }));
 
  const handleSubmit = () => {
    setError('');
    if (!form.tanggal_penerbangan)  { setError('Tanggal penerbangan wajib diisi.'); return; }
    if (!form.flight_number.trim()) { setError('Flight number wajib diisi.'); return; }
    if (!form.nomor_tiket.trim())   { setError('Nomor tiket wajib diisi.'); return; }
    if (!form.pnr.trim())           { setError('PNR wajib diisi.'); return; }
    if (form.bandara_asal === form.bandara_tujuan) { setError('Bandara asal dan tujuan tidak boleh sama.'); return; }
    if (mode === 'tambah') {
      const dup = existingKlaims.find(k =>
        k.flight_number === form.flight_number &&
        k.tanggal_penerbangan === form.tanggal_penerbangan &&
        k.nomor_tiket === form.nomor_tiket
      );
      if (dup) { setError('Klaim duplikat: kombinasi flight number, tanggal, dan nomor tiket sudah pernah diajukan.'); return; }
    }
    onSubmit(form);
  };
 
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>{mode === 'tambah' ? 'Ajukan Klaim Baru' : 'Edit Klaim'}</h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
        <div style={formGridStyle}>
 
          {/* Maskapai */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Maskapai</label>
            <select className="form-control" style={inputSm} value={form.maskapai} onChange={e => set('maskapai', e.target.value)}>
              {maskapaiList.map(m => (
                <option key={m.kode_maskapai} value={m.kode_maskapai}>
                  {m.kode_maskapai} - {m.nama_maskapai}
                </option>
              ))}
            </select>
          </div>
 
          <div style={formGroupStyle}>
            <label style={labelStyle}>Kelas Kabin</label>
            <select className="form-control" style={inputSm} value={form.kelas_kabin} onChange={e => set('kelas_kabin', e.target.value)}>
              {KELAS_KABIN_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
 
          {/* Bandara */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bandara Asal</label>
            <select className="form-control" style={inputSm} value={form.bandara_asal} onChange={e => set('bandara_asal', e.target.value)}>
              {bandaraList.map(b => (
                <option key={b.iata_code} value={b.iata_code}>
                  {b.iata_code} - {b.nama}, {b.kota}
                </option>
              ))}
            </select>
          </div>
 
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bandara Tujuan</label>
            <select className="form-control" style={inputSm} value={form.bandara_tujuan} onChange={e => set('bandara_tujuan', e.target.value)}>
              {bandaraList.map(b => (
                <option key={b.iata_code} value={b.iata_code}>
                  {b.iata_code} - {b.nama}, {b.kota}
                </option>
              ))}
            </select>
          </div>
 
          <div style={formGroupStyle}>
            <label style={labelStyle}>Tanggal Penerbangan</label>
            <input type="date" className="form-control" style={inputSm} value={form.tanggal_penerbangan} onChange={e => set('tanggal_penerbangan', e.target.value)} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Flight Number</label>
            <input type="text" className="form-control" style={inputSm} placeholder="cth: GA404" value={form.flight_number} onChange={e => set('flight_number', e.target.value)} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nomor Tiket</label>
            <input type="text" className="form-control" style={inputSm} value={form.nomor_tiket} onChange={e => set('nomor_tiket', e.target.value)} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>PNR</label>
            <input type="text" className="form-control" style={inputSm} value={form.pnr} onChange={e => set('pnr', e.target.value)} />
          </div>
        </div>
 
        {error && <div style={{ ...errorBannerStyle, marginTop: 12 }}>{error}</div>}
        <button style={submitButtonStyle} onClick={handleSubmit}>
          {mode === 'tambah' ? 'Ajukan Klaim' : 'Simpan Perubahan'}
        </button>
        <button style={cancelButtonStyle} onClick={onClose}>Batal</button>
      </div>
    </div>
  );
}
 
// Confirm Delete Modal
 
function ConfirmDeleteModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={{ ...modalStyle, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <h3 style={modalTitleStyle}>Batalkan Klaim?</h3>
        <p style={{ fontSize: 14, color: 'var(--white-800)', margin: '12px 0 24px' }}>
          Klaim yang dibatalkan tidak dapat dikembalikan.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={cancelButtonStyle} onClick={onClose}>Batal</button>
          <button style={{ ...submitButtonStyle, background: '#ef4444', boxShadow: 'none', marginTop: 0 }} onClick={onConfirm}>
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
 
// Main Component
 
export default function ClaimMissingMilesMember({ emailMember }: ClaimMissingMilesProps) {
  const session       = JSON.parse(sessionStorage.getItem('aeromiles_user') ?? '{}');
  const resolvedEmail = emailMember ?? session.email ?? '';
 
  const [klaims,       setKlaims]       = useState<Klaim[]>([]);
  const [maskapaiList, setMaskapaiList] = useState<MaskapaiOption[]>([]);  
  const [bandaraList,  setBandaraList]  = useState<BandaraOption[]>([]); 
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState<'Semua' | StatusKlaim>('Semua');
  const [showTambah,   setShowTambah]   = useState(false);
  const [editTarget,   setEditTarget]   = useState<Klaim | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Klaim | null>(null);
 
  // Fetch reference data
  useEffect(() => {
    Promise.all([
      supabase.from('maskapai').select('kode_maskapai, nama_maskapai').order('nama_maskapai'),
      supabase.from('bandara').select('iata_code, nama, kota').order('kota'),
    ]).then(([{ data: mk }, { data: bd }]) => {
      if (mk) setMaskapaiList(mk);
      if (bd) setBandaraList(bd);
    });
  }, []);
 
  // Fetch klaim
  const fetchKlaims = async () => {
    if (!resolvedEmail) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('claim_missing_miles')
      .select('*')
      .eq('email_member', resolvedEmail)
      .order('timestamp', { ascending: false });
 
    if (error) { console.error('fetchKlaims:', error.message); }
    else {
      setKlaims((data ?? []).map((row: any) => ({
        id:                  row.id,
        nomor_klaim:         `CLM-${String(row.id).padStart(3, '0')}`,
        email_member:        row.email_member,
        maskapai:            row.maskapai,
        bandara_asal:        row.bandara_asal,
        bandara_tujuan:      row.bandara_tujuan,
        tanggal_penerbangan: row.tanggal_penerbangan,
        flight_number:       row.flight_number,
        nomor_tiket:         row.nomor_tiket,
        kelas_kabin:         row.kelas_kabin,
        pnr:                 row.pnr,
        status_penerimaan:   row.status_penerimaan as StatusKlaim,
        timestamp:           row.timestamp,
      })));
    }
    setLoading(false);
  };
 
  useEffect(() => { fetchKlaims(); }, [resolvedEmail]);
 
  // CRUD 
  const handleTambah = async (form: FormState) => {
    const { error } = await supabase.from('claim_missing_miles').insert({
      email_member: resolvedEmail, maskapai: form.maskapai,
      bandara_asal: form.bandara_asal, bandara_tujuan: form.bandara_tujuan,
      tanggal_penerbangan: form.tanggal_penerbangan, flight_number: form.flight_number,
      nomor_tiket: form.nomor_tiket, kelas_kabin: form.kelas_kabin,
      pnr: form.pnr, status_penerimaan: 'Menunggu', timestamp: nowTimestamp(),
    });
    if (error) { alert('Gagal mengajukan klaim: ' + (error.message.includes('unique') ? 'Klaim duplikat.' : error.message)); return; }
    setShowTambah(false);
    fetchKlaims();
  };
 
  const handleEdit = async (form: FormState) => {
    if (!editTarget) return;
    const { error } = await supabase.from('claim_missing_miles')
      .update({
        maskapai: form.maskapai, bandara_asal: form.bandara_asal,
        bandara_tujuan: form.bandara_tujuan, tanggal_penerbangan: form.tanggal_penerbangan,
        flight_number: form.flight_number, nomor_tiket: form.nomor_tiket,
        kelas_kabin: form.kelas_kabin, pnr: form.pnr,
      })
      .eq('id', editTarget.id).eq('status_penerimaan', 'Menunggu');
    if (error) { alert('Gagal menyimpan perubahan: ' + error.message); return; }
    setEditTarget(null);
    fetchKlaims();
  };
 
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('claim_missing_miles')
      .delete().eq('id', deleteTarget.id).eq('status_penerimaan', 'Menunggu');
    if (error) { alert('Gagal membatalkan klaim: ' + error.message); return; }
    setDeleteTarget(null);
    fetchKlaims();
  };
 
  const filtered = klaims.filter(k => filter === 'Semua' ? true : k.status_penerimaan === filter);
 
  // Render
 
  return (
    <div className="page-container" style={{ maxWidth: 1100, textAlign: 'left' }}>
 
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Klaim Missing Miles</h1>
        <button className="btn-primary" onClick={() => setShowTambah(true)}>+ Ajukan Klaim</button>
      </div>
 
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['Semua', 'Menunggu', 'Disetujui', 'Ditolak'] as const).map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} style={{
            padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
            backgroundColor: filter === tab ? 'var(--primary-800)' : '#e5e7eb',
            color: filter === tab ? '#fff' : 'var(--white-900)', transition: 'all 0.15s',
          }}>{tab}</button>
        ))}
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
                  {['No. Klaim','Maskapai','Rute','Tanggal','Flight','Kelas','Status','Tanggal Pengajuan','Aksi'].map(h => (
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
                ) : filtered.map((k, i) => (
                  <tr key={k.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'transparent' : '#fafafa' }}>
                    <td style={tdStyle}><strong>{k.nomor_klaim}</strong></td>
                    <td style={tdStyle}>{k.maskapai}</td>
                    <td style={tdStyle}><span style={{ whiteSpace: 'nowrap' }}>{k.bandara_asal} → {k.bandara_tujuan}</span></td>
                    <td style={tdStyle}>{k.tanggal_penerbangan}</td>
                    <td style={tdStyle}>{k.flight_number}</td>
                    <td style={tdStyle}>{k.kelas_kabin}</td>
                    <td style={tdStyle}><StatusBadge status={k.status_penerimaan} /></td>
                    <td style={tdStyle}>{k.timestamp}</td>
                    <td style={tdStyle}>
                      {k.status_penerimaan === 'Menunggu' ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button onClick={() => setEditTarget(k)} title="Edit klaim" style={iconButtonStyle}>✏️</button>
                          <button onClick={() => setDeleteTarget(k)} title="Batalkan klaim" style={{ ...iconButtonStyle, color: '#ef4444' }}>🗑️</button>
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
 
      {/* Modals */}
      {showTambah && (
        <KlaimFormModal
          mode="tambah"
          initialValues={emptyForm(maskapaiList, bandaraList)}
          existingKlaims={klaims}
          maskapaiList={maskapaiList}
          bandaraList={bandaraList}
          onSubmit={handleTambah}
          onClose={() => setShowTambah(false)}
        />
      )}
      {editTarget && (
        <KlaimFormModal
          mode="edit"
          initialValues={{
            maskapai: editTarget.maskapai, kelas_kabin: editTarget.kelas_kabin,
            bandara_asal: editTarget.bandara_asal, bandara_tujuan: editTarget.bandara_tujuan,
            tanggal_penerbangan: editTarget.tanggal_penerbangan, flight_number: editTarget.flight_number,
            nomor_tiket: editTarget.nomor_tiket, pnr: editTarget.pnr,
          }}
          existingKlaims={klaims.filter(k => k.id !== editTarget.id)}
          maskapaiList={maskapaiList}
          bandaraList={bandaraList}
          onSubmit={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && <ConfirmDeleteModal onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
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