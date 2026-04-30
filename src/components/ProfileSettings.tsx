import { useState } from 'react';

// Types 

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

// Mock Data 

const mockMember: MemberData = {
  role: 'member',
  email: 'john@example.com',
  nomor_member: 'M0001',
  tanggal_bergabung: '2024-01-15',
  salutation: 'Mr.',
  first_name: 'John',
  middle_name: 'William',
  last_name: 'Doe',
  country_code: '+62',
  mobile_number: '81234567890',
  tanggal_lahir: '1990-05-15',
  kewarganegaraan: 'Indonesia',
};

const mockStaf: StafData = {
  role: 'staf',
  email: 'admin@aeromiles.com',
  id_staf: 'S0001',
  salutation: 'Mr.',
  first_name: 'Admin',
  middle_name: '',
  last_name: 'Aero',
  country_code: '+62',
  mobile_number: '81111111111',
  tanggal_lahir: '1988-01-01',
  kewarganegaraan: 'Indonesia',
  kode_maskapai: 'GA',
};

// Options 

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

// Sub-components 

function FormField({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`form-group${fullWidth ? ' full-width' : ''}`}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [fields, setFields] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasi: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSimpan = () => {
    setError('');
    if (!fields.passwordLama) { setError('Password lama wajib diisi.'); return; }
    if (fields.passwordBaru.length < 6) { setError('Password baru minimal 6 karakter.'); return; }
    if (fields.passwordBaru !== fields.konfirmasi) { setError('Konfirmasi password tidak cocok.'); return; }
    // TODO: kirim ke backend
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--white-950)' }}>
            Ubah Password
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Password Lama">
            <input
              type="password"
              className="form-control"
              value={fields.passwordLama}
              onChange={e => setFields(f => ({ ...f, passwordLama: e.target.value }))}
              placeholder="Masukkan password lama"
            />
          </FormField>
          <FormField label="Password Baru">
            <input
              type="password"
              className="form-control"
              value={fields.passwordBaru}
              onChange={e => setFields(f => ({ ...f, passwordBaru: e.target.value }))}
              placeholder="Minimal 6 karakter"
            />
          </FormField>
          <FormField label="Konfirmasi Password Baru">
            <input
              type="password"
              className="form-control"
              value={fields.konfirmasi}
              onChange={e => setFields(f => ({ ...f, konfirmasi: e.target.value }))}
              placeholder="Ulangi password baru"
            />
          </FormField>

          {error && (
            <div style={errorBannerStyle}>{error}</div>
          )}
          {success && (
            <div style={successBannerStyle}>Password berhasil diubah!</div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={handleSimpan} className="btn-primary" style={{ marginTop: 0 }}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component 

export default function ProfileSettings({ role }: ProfileSettingsProps) {
  const initialData: ProfileData = role === 'member' ? mockMember : mockStaf;

  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Sync ketika role prop berubah (untuk testing)
  const activeData: ProfileData = role === 'member' ? { ...mockMember, ...formData, role: 'member' } : { ...mockStaf, ...formData, role: 'staf' };

  const update = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
    setSaveError('');
  };

  const handleSimpan = () => {
    setSaveError('');
    if (!activeData.first_name.trim()) { setSaveError('Nama depan wajib diisi.'); return; }
    if (!activeData.last_name.trim()) { setSaveError('Nama belakang wajib diisi.'); return; }
    if (!activeData.mobile_number.trim()) { setSaveError('Nomor HP wajib diisi.'); return; }
    if (!activeData.tanggal_lahir) { setSaveError('Tanggal lahir wajib diisi.'); return; }

    const payload = {
      ...activeData,
      first_mid_name: [activeData.first_name, activeData.middle_name].filter(Boolean).join(' '),
    };
    // TODO: kirim PUT ke backend /api/profil
    console.log('Menyimpan profil:', payload);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="page-container" style={{ maxWidth: 860, textAlign: 'left' }}>
      <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, textAlign: 'left' }}>
        Pengaturan Profil
      </h1>

      {/* Data Profil */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="card-title" style={{ color: '#111', textAlign: 'left' }}>Data Profil</h2>

        <div className="form-grid">

          {/* Email — read only */}
          <FormField label="Email" fullWidth>
            <input
              type="email"
              className="form-control"
              value={activeData.email}
              disabled
              title="Email tidak dapat diubah"
            />
          </FormField>

          {/* Member: Nomor Member + Tanggal Bergabung (read only) */}
          {role === 'member' && (
            <>
              <FormField label="Nomor Member">
                <input
                  type="text"
                  className="form-control"
                  value={(activeData as MemberData).nomor_member}
                  disabled
                  title="Nomor member tidak dapat diubah"
                />
              </FormField>
              <FormField label="Tanggal Bergabung">
                <input
                  type="text"
                  className="form-control"
                  value={(activeData as MemberData).tanggal_bergabung}
                  disabled
                  title="Tanggal bergabung tidak dapat diubah"
                />
              </FormField>
            </>
          )}

          {/* Staf: ID Staf (read only) */}
          {role === 'staf' && (
            <FormField label="ID Staf" fullWidth>
              <input
                type="text"
                className="form-control"
                value={(activeData as StafData).id_staf}
                disabled
                title="ID Staf tidak dapat diubah"
              />
            </FormField>
          )}

          {/* Salutation */}
          <FormField label="Salutation">
            <select
              className="form-control"
              value={activeData.salutation}
              onChange={e => update('salutation', e.target.value)}
            >
              {SALUTATION_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>

          <div />

          {/* Nama Depan + Nama Tengah */}
          <FormField label="Nama Depan">
            <input
              type="text"
              className="form-control"
              value={activeData.first_name}
              onChange={e => update('first_name', e.target.value)}
              placeholder="Nama depan"
            />
          </FormField>
          <FormField label="Nama Tengah">
            <input
              type="text"
              className="form-control"
              value={activeData.middle_name}
              onChange={e => update('middle_name', e.target.value)}
              placeholder="Nama tengah (opsional)"
            />
          </FormField>
          <FormField label="Nama Belakang">
            <input
              type="text"
              className="form-control"
              value={activeData.last_name}
              onChange={e => update('last_name', e.target.value)}
              placeholder="Nama belakang"
            />
          </FormField>

          {/* Kewarganegaraan */}
          <FormField label="Kewarganegaraan">
            <select
              className="form-control"
              value={activeData.kewarganegaraan}
              onChange={e => update('kewarganegaraan', e.target.value)}
            >
              {KEWARGANEGARAAN_OPTIONS.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </FormField>

          {/* Country Code + Nomor HP */}
          <FormField label="Country Code">
            <select
              className="form-control"
              value={activeData.country_code}
              onChange={e => update('country_code', e.target.value)}
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Nomor HP">
            <input
              type="tel"
              className="form-control"
              value={activeData.mobile_number}
              onChange={e => update('mobile_number', e.target.value.replace(/\D/g, ''))}
              placeholder="cth: 81234567890"
            />
          </FormField>

          {/* Tanggal Lahir */}
          <FormField label="Tanggal Lahir">
            <input
              type="date"
              className="form-control"
              value={activeData.tanggal_lahir}
              onChange={e => update('tanggal_lahir', e.target.value)}
            />
          </FormField>

          {/* Staf: Kode Maskapai (editable) */}
          {role === 'staf' && (
            <FormField label="Kode Maskapai">
              <select
                className="form-control"
                value={(activeData as StafData).kode_maskapai}
                onChange={e => update('kode_maskapai', e.target.value)}
              >
                {MASKAPAI_OPTIONS.map(m => (
                  <option key={m.kode} value={m.kode}>
                    {m.kode} - {m.nama}
                  </option>
                ))}
              </select>
            </FormField>
          )}

        </div>

        {/* Feedback */}
        {saveError && <div style={{ ...errorBannerStyle, marginTop: 16 }}>{saveError}</div>}
        {saveSuccess && <div style={{ ...successBannerStyle, marginTop: 16 }}>Perubahan berhasil disimpan!</div>}

        <button className="btn-primary" onClick={handleSimpan}>
          Simpan Perubahan
        </button>
      </div>

      {/* Ubah Password */}
      <div className="card">
        <h2 className="card-title" style={{ color: '#111', textAlign: 'left' }}>Ubah Password</h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          style={ubahPasswordButtonStyle}
        >
          Ubah Password
        </button>
      </div>

      {/* Modal Ubah Password */}
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

// Inline Styles

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalStyle: React.CSSProperties = {
  background: 'var(--white-50)',
  borderRadius: 12,
  padding: '32px',
  width: '100%',
  maxWidth: 480,
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
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

const errorBannerStyle: React.CSSProperties = {
  backgroundColor: '#fff0f0',
  border: '1px solid #ffcccc',
  color: '#c00',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
};

const successBannerStyle: React.CSSProperties = {
  backgroundColor: '#f0fff4',
  border: '1px solid #b2f5c8',
  color: '#1a7a3a',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
};

const ubahPasswordButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  border: '1px solid #d0d0d0',
  borderRadius: 8,
  background: 'var(--white-50)',
  color: 'var(--white-900)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
