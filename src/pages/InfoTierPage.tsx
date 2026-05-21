import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './InfoTierPage.css';
interface Tier {
  id_tier: string;
  nama: string;
  minimal_frekuensi_terbang: number;
  minimal_tier_miles: number;
}

interface MemberData {
  nomor_member: string;
  total_miles: number;
  id_tier: string;
  tier_nama: string;
}

interface TierInfoPageProps {
  emailMember?: string; 
}

export default function TierInfoPage({ emailMember = 'user1@mail.com' }: TierInfoPageProps) {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTierAndMemberData();
  }, [emailMember]);

  const fetchTierAndMemberData = async () => {
    setLoading(true);

    try {
      const { data: tierData, error: tierError } = await supabase
        .from('tier')
        .select('*')
        .order('minimal_tier_miles', { ascending: true });

      if (tierError) throw tierError;
      if (tierData) setTiers(tierData);

      const { data: memData, error: memError } = await supabase
        .from('member')
        .select(`
          nomor_member,
          total_miles,
          id_tier,
          tier ( nama )
        `)
        .eq('email', emailMember)
        .single();

      if (memError) throw memError;
      
      if (memData) {
        setMember({
          nomor_member: memData.nomor_member,
          total_miles: memData.total_miles,
          id_tier: memData.id_tier,
          tier_nama: (memData.tier as any)?.nama || ''
        });
      }
    } catch (error: any) {
      console.error("Gagal mengambil data tier/member:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat informasi tier...</div>;
  }

  if (!member) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Data member tidak ditemukan.</div>;
  }

  const currentTierIndex = tiers.findIndex(t => t.id_tier === member.id_tier);
  const nextTier = tiers[currentTierIndex + 1];
  const targetMiles = nextTier ? nextTier.minimal_tier_miles : member.total_miles;
  const milesNeeded = nextTier ? Math.max(0, targetMiles - member.total_miles) : 0;
  
  const milesProgress = targetMiles > 0 ? Math.min(100, (member.total_miles / targetMiles) * 100) : 100;

  return (
    <div className="tier-container">
      <div className="tier-header-section">
        <h1 className="tier-main-title">Informasi Tier & Keuntungan</h1>
        <p className="tier-sub-title">Pantau status keanggotaan dan progres Anda menuju tier berikutnya.</p>
      </div>

      <div className="current-tier-card">
        <div className="current-tier-left">
          <div className="tier-badge-label">Tier Saat Ini</div>
          <h2 className="current-tier-name">{member.tier_nama}</h2>
          <div className="current-tier-id">Nomor Member: <strong>{member.nomor_member}</strong></div>
        </div>

        {nextTier ? (
          <div className="current-tier-progress">
            <h3 className="progress-heading">Progres menuju {nextTier.nama}</h3>
            
            <div className="progress-group">
              <div className="progress-labels">
                <span className="progress-text-black">
                  <strong>{member.total_miles.toLocaleString('id-ID')}</strong> / {targetMiles.toLocaleString('id-ID')} Miles
                </span>
                <span className="progress-text-gray">Kurang {milesNeeded.toLocaleString('id-ID')} miles</span>
              </div>
              <div className="progress-track">
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

      <div className="tier-list-container">
        {tiers.map((tier) => {
          const isCurrent = tier.id_tier === member.id_tier;
          
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
                    <span>Min. <strong>{tier.minimal_tier_miles.toLocaleString('id-ID')}</strong> Miles</span>
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