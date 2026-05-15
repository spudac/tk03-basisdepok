import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { hashSHA256 } from '@utils/hash';
import '@components/Fitur.css';

interface BasePengguna {
  email: string;
  salutation: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  country_code: string;
  mobile_number: string;
  tanggal_lahir: string;
  kewarganegaraan: string;
}

interface MemberData extends BasePengguna {
  role: 'member';
  nomor_member: string;
  tanggal_bergabung: string;
}

interface StafData extends BasePengguna {
  role: 'staf';
  id_staf: string;
  kode_maskapai: string;
}

type ProfileData = MemberData | StafData;

interface ProfileSettingsProps {
  role: 'member' | 'staf';
  email: string;
}

const SALUTATION_OPTIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];

const COUNTRY_CODES = [
  { code: '+62', label: '+62' },
  { code: '+65', label: '+65' },
  { code: '+81', label: '+81' },
  { code: '+971', label: '+971' },
  { code: '+49', label: '+49' },
  { code: '+1',  label: '+1' },
  { code: '+44', label: '+44' },
  { code: '+61', label: '+61' },
  { code: '+60', label: '+60' },
  { code: '+66', label: '+66' },
];

const KEWARGANEGARAAN_OPTIONS = [
  'Indonesia', 'Singapore', 'Japan', 'United Arab Emirates',
  'Germany', 'United States', 'United Kingdom', 'Australia',
  'Malaysia', 'Thailand', 'Philippines', 'Vietnam', 'India',
  'China', 'South Korea',
];

function FormField({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties; }) {
  return (
    <div className="form-group" style={style}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function PasswordModal({ onClose, email }: { onClose: () => void, email: string }) {
  const [fields, setFields] = useState({ passwordLama: '', passwordBaru: '', konfirmasi: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimpan = async () => {
    setError('');
    if (!fields.passwordLama) { setError('Password lama wajib diisi.'); return; }
    if (fields.passwordBaru.length < 6) { setError('Password baru minimal 6 karakter.'); return; }
    if (fields.passwordBaru !== fields.konfirmasi) { setError('Konfirmasi password tidak cocok.'); return; }

    setIsSubmitting(true);
    try {
      const hashedOld = await hashSHA256(fields.passwordLama);
      const { error: rpcError } = await supabase.rpc("login_validation", {
        login_email: email,
        hashed_password: hashedOld,
      });
      if (rpcError) throw new Error("Password lama salah!");

      const hashedNew = await hashSHA256(fields.passwordBaru);

      const { error: updateError } = await supabase
        .from('pengguna')
        .update({ password: hashedNew })
        .eq('email', email);
      if (updateError) throw updateError;

      await supabase.auth.updateUser({ password: fields.passwordBaru });

      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengubah password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--white-950)' }}>Ubah Password</h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Password Lama">
            <input type="password" className="form-control" value={fields.passwordLama} onChange={e => setFields(f => ({ ...f, passwordLama: e.target.value }))} placeholder="Masukkan password lama" />
          </FormField>
          <FormField label="Password Baru">
            <input type="password" className="form-control" value={fields.passwordBaru} onChange={e => setFields(f => ({ ...f, passwordBaru: e.target.value }))} placeholder="Minimal 6 karakter" />
          </FormField>
          <FormField label="Konfirmasi Password Baru">
            <input type="password" className="form-control" value={fields.konfirmasi} onChange={e => setFields(f => ({ ...f, konfirmasi: e.target.value }))} placeholder="Ulangi password baru" />
          </FormField>

          {error && <div style={errorBannerStyle}>{error}</div>}
          {success && <div style={successBannerStyle}>Password berhasil diubah!</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={handleSimpan} className="btn-primary" style={{ marginTop: 0 }} disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettings({ role, email }: ProfileSettingsProps) {
  const [formData, setFormData] = useState<ProfileData | null>(null);
  const [maskapaiList, setMaskapaiList] = useState<{kode_maskapai: string, nama_maskapai: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        if (role === 'staf') {
          const { data: maskapaiData } = await supabase.from('maskapai').select('kode_maskapai, nama_maskapai').order('nama_maskapai');
          if (maskapaiData) setMaskapaiList(maskapaiData);
        }

        const { data: penggunaData, error: penggunaErr } = await supabase
          .from('pengguna')
          .select('*')
          .eq('email', email)
          .single();
        if (penggunaErr) throw penggunaErr;

        const nameParts = (penggunaData.first_mid_name || '').split(' ');
        const firstName = nameParts[0] || '';
        const middleName = nameParts.slice(1).join(' ') || '';

        let roleSpecificData = {};
        if (role === 'member') {
          const { data: memberData, error: memberErr } = await supabase.from('member').select('*').eq('email', email).single();
          if (memberErr) throw memberErr;
          roleSpecificData = memberData;
        } else {
          const { data: stafData, error: stafErr } = await supabase.from('staf').select('*').eq('email', email).single();
          if (stafErr) throw stafErr;
          roleSpecificData = stafData;
        }

        setFormData({
          role,
          email: penggunaData.email,
          salutation: penggunaData.salutation,
          first_name: firstName,
          middle_name: middleName,
          last_name: penggunaData.last_name,
          country_code: penggunaData.country_code,
          mobile_number: penggunaData.mobile_number,
          tanggal_lahir: penggunaData.tanggal_lahir,
          kewarganegaraan: penggunaData.kewarganegaraan,
          ...roleSpecificData
        } as ProfileData);

      } catch (err: unknown) {
        console.error("Gagal memuat profil:", err);
        setSaveError("Gagal memuat data profil dari database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [email, role]);

  const update = (field: string, value: string) => {
    if (!formData) return;
    setFormData(prev => ({ ...prev, [field]: value } as ProfileData));
    setSaveSuccess(false);
    setSaveError('');
  };

  const handleSimpan = async () => {
    if (!formData) return;
    setSaveError('');
    if (!formData.first_name.trim()) { setSaveError('Nama depan wajib diisi.'); return; }
    if (!formData.last_name.trim()) { setSaveError('Nama belakang wajib diisi.'); return; }
    if (!formData.mobile_number.trim()) { setSaveError('Nomor HP wajib diisi.'); return; }
    if (!formData.tanggal_lahir) { setSaveError('Tanggal lahir wajib diisi.'); return; }

    setIsSaving(true);
    try {
      const first_mid_name = [formData.first_name, formData.middle_name].filter(Boolean).join(' ');

      const { error: penggunaErr } = await supabase
        .from('pengguna')
        .update({
          salutation: formData.salutation,
          first_mid_name: first_mid_name,
          last_name: formData.last_name,
          country_code: formData.country_code,
          mobile_number: formData.mobile_number,
          tanggal_lahir: formData.tanggal_lahir,
          kewarganegaraan: formData.kewarganegaraan
        })
        .eq('email', email);
      if (penggunaErr) throw penggunaErr;

      if (role === 'staf') {
        const { error: stafErr } = await supabase
          .from('staf')
          .update({ kode_maskapai: (formData as StafData).kode_maskapai })
          .eq('email', email);
        if (stafErr) throw stafErr;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>Memuat data profil...</div>;
  }

  if (!formData) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Gagal memuat profil. Pastikan email terdaftar.</div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: 960, textAlign: 'left', width: '100%' }}>
      <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, marginBottom: 24, textAlign: 'left' }}>
        Pengaturan Profil
      </h1>

      <div className="card" style={{ padding: '28px 36px' }}>
        <h2 className="card-title" style={{ color: '#111', textAlign: 'left', marginBottom: 20 }}>Data Profil</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <FormField label="Email" style={{ gridColumn: 'span 2' }}>
            <input type="email" className="form-control" value={formData.email} disabled title="Email tidak dapat diubah" />
          </FormField>
          <FormField label="Salutation">
            <select className="form-control" value={formData.salutation} onChange={e => update('salutation', e.target.value)}>
              {SALUTATION_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Nama Depan">
            <input type="text" className="form-control" value={formData.first_name} onChange={e => update('first_name', e.target.value)} placeholder="Nama depan" />
          </FormField>
          <FormField label="Nama Tengah">
            <input type="text" className="form-control" value={formData.middle_name} onChange={e => update('middle_name', e.target.value)} placeholder="Opsional" />
          </FormField>
          <FormField label="Nama Belakang">
            <input type="text" className="form-control" value={formData.last_name} onChange={e => update('last_name', e.target.value)} placeholder="Nama belakang" />
          </FormField>

          <FormField label="Kewarganegaraan">
            <select className="form-control" value={formData.kewarganegaraan} onChange={e => update('kewarganegaraan', e.target.value)}>
              {KEWARGANEGARAAN_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </FormField>
          <FormField label="Country Code">
            <select className="form-control" value={formData.country_code} onChange={e => update('country_code', e.target.value)}>
              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </FormField>
          <FormField label="Nomor HP">
            <input type="tel" className="form-control" value={formData.mobile_number} onChange={e => update('mobile_number', e.target.value.replace(/\D/g, ''))} placeholder="cth: 81234567890" />
          </FormField>

          <FormField label="Tanggal Lahir">
            <input type="date" className="form-control" value={formData.tanggal_lahir} onChange={e => update('tanggal_lahir', e.target.value)} />
          </FormField>

          {role === 'member' && (
            <>
              <FormField label="Nomor Member">
                <input type="text" className="form-control" value={(formData as MemberData).nomor_member || '-'} disabled />
              </FormField>
              <FormField label="Tanggal Bergabung">
                <input type="text" className="form-control" value={(formData as MemberData).tanggal_bergabung || '-'} disabled />
              </FormField>
            </>
          )}

          {role === 'staf' && (
            <>
              <FormField label="ID Staf">
                <input type="text" className="form-control" value={(formData as StafData).id_staf || '-'} disabled />
              </FormField>
              <FormField label="Kode Maskapai">
                <select className="form-control" value={(formData as StafData).kode_maskapai} onChange={e => update('kode_maskapai', e.target.value)}>
                  {maskapaiList.map(m => (
                    <option key={m.kode_maskapai} value={m.kode_maskapai}>
                      {m.kode_maskapai} - {m.nama_maskapai}
                    </option>
                  ))}
                </select>
              </FormField>
            </>
          )}
        </div>

        {saveError && <div style={{ ...errorBannerStyle, marginTop: 16 }}>{saveError}</div>}
        {saveSuccess && <div style={{ ...successBannerStyle, marginTop: 16 }}>Perubahan berhasil disimpan!</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 24, borderTop: '1px solid #e2eaff' }}>
          <button className="btn-outline" onClick={() => setShowPasswordModal(true)} style={{ margin: 0 }}>
            Ubah Password
          </button>
          
          <button className="btn-primary" onClick={handleSimpan} style={{ margin: 0 }} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} email={email} />}
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', fontFamily: "'Inter', sans-serif" };
const modalStyle: React.CSSProperties = { background: '#ffffff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: 480, boxShadow: '0 10px 30px rgba(77,111,224,0.08)', border: '1px solid #e2eaff', fontFamily: "'Inter', sans-serif" };
const modalHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 };
const closeButtonStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--white-800)', lineHeight: 1, padding: '0 4px' };
const errorBannerStyle: React.CSSProperties = { backgroundColor: '#fff0f0', border: '1px solid #ffcccc', color: '#c00', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontFamily: "'Inter', sans-serif" };
const successBannerStyle: React.CSSProperties = { backgroundColor: '#f0fff4', border: '1px solid #b2f5c8', color: '#1a7a3a', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontFamily: "'Inter', sans-serif" };