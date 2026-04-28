import type { Member } from '../types';
import { MOCK_TIERS } from '../data/mockData';
import './InfoTierPage.css';

interface TierInfoPageProps {
  member: Member;
}

export default function TierInfoPage({ member }: TierInfoPageProps) {
  return (
    <div className="tier-container">
      <div className="tier-header">
        <h1>Informasi Tier & Keuntungan</h1>
        <p>Tingkatkan frekuensi terbang dan kumpulkan miles untuk mencapai tier tertinggi dan nikmati keuntungan eksklusif.</p>
      </div>

      <div className="tier-grid">
        {MOCK_TIERS.map((tier) => {
          const isCurrentTier = member.tier_nama.toLowerCase() === tier.nama.toLowerCase();

          return (
            <div 
              key={tier.id_tier} 
              className={`tier-card ${isCurrentTier ? 'current-tier' : ''}`}
            >
              {isCurrentTier && <div className="tier-badge-current">Tier Anda Saat Ini</div>}
              
              <div className={`tier-header-box bg-tier-${tier.nama.toLowerCase()}`}>
                <h2 className="tier-title">{tier.nama}</h2>
                <span className="tier-id">{tier.id_tier}</span>
              </div>

              <div className="tier-requirements">
                <h3 className="req-title">Syarat Pencapaian</h3>
                <ul className="req-list">
                  <li>
                    <span className="req-label">Minimal Frekuensi Terbang:</span>
                    <span className="req-value">{tier.minimal_frekuensi_terbang} Kali</span>
                  </li>
                  <li>
                    <span className="req-label">Minimal Tier Miles:</span>
                    <span className="req-value">{tier.minimal_tier_miles.toLocaleString()} Miles</span>
                  </li>
                </ul>
              </div>

              {/* Dummy Keuntungan (Karena di SQL tidak ada tabel khusus keuntungan, kita hardcode sbg pemanis UI) */}
              <div className="tier-benefits">
                <h3 className="req-title">Keuntungan Utama</h3>
                <ul className="benefit-list">
                  <li>Prioritas Check-in</li>
                  {tier.minimal_tier_miles >= 10000 && <li>Ekstra Bagasi 10kg</li>}
                  {tier.minimal_tier_miles >= 30000 && <li>Akses Airport Lounge</li>}
                  {tier.minimal_tier_miles >= 50000 && <li>Gratis Upgrade Kelas Penerbangan</li>}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}