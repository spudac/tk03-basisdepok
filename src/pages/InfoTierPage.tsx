import type { Member } from '../types';
import { MOCK_TIERS } from '../data/mockData';
import './InfoTierPage.css';

interface TierInfoPageProps {
  member: Member;
}

export default function TierInfoPage({ member }: TierInfoPageProps) {
  // Mencari tier saat ini dan tier berikutnya
  const currentTierIndex = MOCK_TIERS.findIndex(t => t.nama.toLowerCase() === member.tier_nama.toLowerCase());
  const nextTier = MOCK_TIERS[currentTierIndex + 1];

  // Perhitungan khusus untuk Progress Bar Miles
  const targetMiles = nextTier ? nextTier.minimal_tier_miles : member.total_miles;
  const milesNeeded = nextTier ? Math.max(0, targetMiles - member.total_miles) : 0;
  
  // Menghitung persentase lebar warna biru pada bar (0% sampai 100%)
  const milesProgress = targetMiles > 0 ? Math.min(100, (member.total_miles / targetMiles) * 100) : 100;

  return (
    <div className="tier-container">
      <div className="tier-header-section">
        <h1 className="tier-main-title">Informasi Tier & Keuntungan</h1>
        <p className="tier-sub-title">Pantau status keanggotaan dan progres Anda menuju tier berikutnya.</p>
      </div>

      {/* STATUS TIER SAAT INI & PROGRESS */}
      <div className="current-tier-card">
        <div className="current-tier-left">
          <div className="tier-badge-label">Tier Saat Ini</div>
          <h2 className="current-tier-name">{member.tier_nama}</h2>
          <div className="current-tier-id">Nomor Member: <strong>{member.nomor_member}</strong></div>
        </div>

        {nextTier ? (
          <div className="current-tier-progress">
            <h3 className="progress-heading">Progres menuju {nextTier.nama}</h3>
            
            {/* HANYA PROGRESS MILES (Penerbangan dihapus) */}
            <div className="progress-group">
              <div className="progress-labels">
                <span className="progress-text-black">
                  <strong>{member.total_miles.toLocaleString()}</strong> / {targetMiles.toLocaleString()} Miles
                </span>
                <span className="progress-text-gray">Kurang {milesNeeded.toLocaleString()} miles</span>
              </div>
              <div className="progress-track">
                {/* Lebar warna biru diatur otomatis oleh variabel milesProgress */}
                <div className="progress-fill" style={{ width: `${milesProgress}%` }}></div>
              </div>
            </div>

          </div>
        ) : (
          <div className="current-tier-progress flex-center">
            <h3 className="progress-heading">Anda telah mencapai Tier Tertinggi!</h3>
          </div>
        )}
      </div>

      {/* DAFTAR TIER (GRID) */}
      <div className="tier-list-container">
        {MOCK_TIERS.map((tier) => {
          const isCurrent = tier.nama.toLowerCase() === member.tier_nama.toLowerCase();
          
          return (
            <div key={tier.id_tier} className={`tier-item-card ${isCurrent ? 'active-tier-card' : ''}`}>
              {isCurrent && <div className="active-badge">Tier Saat Ini</div>}
              
              <div className="tier-item-header">
                <h3 className="tier-item-name">{tier.nama}</h3>
                <span className="tier-item-id">{tier.id_tier}</span>
              </div>

              <div className="tier-item-body">
                <div className="tier-req-block">
                  <div className="req-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3 3-3-1-2 2 5 2 2 5 2-2-1-3 3-3 5 6 1.2-.7c.4-.2.7-.6.6-1.1Z"/></svg>
                    <span>Min. <strong>{tier.minimal_tier_miles.toLocaleString()}</strong> Miles</span>
                  </div>
                  <div className="req-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    <span>Min. <strong>{tier.minimal_frekuensi_terbang}</strong> Penerbangan</span>
                  </div>
                </div>

                <div className="tier-benefits-block">
                  <div className="benefits-title">Keuntungan Tier:</div>
                  <ul className="benefits-list">
                    <li>Prioritas Check-in & Boarding</li>
                    {tier.minimal_tier_miles >= 10000 && <li>Ekstra Bagasi 10kg</li>}
                    {tier.minimal_tier_miles >= 30000 && <li>Akses Lounge Eksklusif</li>}
                    {tier.minimal_tier_miles >= 50000 && <li>Gratis Upgrade Kelas 1x/Tahun</li>}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}