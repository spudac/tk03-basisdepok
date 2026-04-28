// src/pages/DashboardPage.tsx
import type { Role, Member, Staf, DashboardStats, Transaction } from '../types';
import './DashboardPage.css';

interface DashboardProps {
  role: Role;
  member: Member;
  staf: Staf;
  stats: DashboardStats;
  recentTransactions: Transaction[];
}

export default function DashboardPage({
  role,
  member,
  staf,
  stats,
  recentTransactions,
}: DashboardProps) {
  
  if (role === 'guest') {
    return (
      <div className="dashboard-container guest-view">
        <div className="guest-card">
          <h2>Selamat Datang di AeroMiles</h2>
          <p>Silakan login untuk melihat dashboard Anda.</p>
        </div>
      </div>
    );
  }

  const isStaf = role === 'staf';
  const userData = isStaf ? staf : member;
  const fullName = `${userData.salutation} ${userData.first_mid_name} ${userData.last_name}`;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Selamat datang, {fullName}</p>
      </div>

      {/* CARD 1: INFORMASI PRIBADI */}
      <section className="dashboard-section card">
        <h3 className="section-title">Informasi Pribadi</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Nama Lengkap</span>
            <span className="info-value">{fullName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{userData.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Telepon</span>
            <span className="info-value">+{userData.country_code} {userData.mobile_number}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Kewarganegaraan</span>
            <span className="info-value">{userData.kewarganegaraan}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tanggal Lahir</span>
            <span className="info-value">{userData.tanggal_lahir}</span>
          </div>
          {!isStaf && (
            <div className="info-item">
              <span className="info-label">Tanggal Bergabung</span>
              <span className="info-value">{(userData as Member).tanggal_bergabung}</span>
            </div>
          )}
        </div>
      </section>

      {/* CARD 2: STATISTIK DENGAN ICON (GRID DISESUAIKAN) */}
      <section className="stats-grid">
        {!isStaf ? (
          <>
            <div className="stat-card">
              <div className="stat-icon-wrapper blue-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Nomor Member</span>
                <span className="stat-value">{(userData as Member).nomor_member}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper yellow-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Tier</span>
                <span className={`tier-badge tier-${(userData as Member).tier_nama.toLowerCase()}`}>
                  {(userData as Member).tier_nama}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper light-blue-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3 3-3-1-2 2 5 2 2 5 2-2-1-3 3-3 5 6 1.2-.7c.4-.2.7-.6.6-1.1Z"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Miles</span>
                <span className="stat-value">{(userData as Member).total_miles.toLocaleString()}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper green-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Award Miles</span>
                <span className="stat-value">{(userData as Member).award_miles.toLocaleString()}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon-wrapper blue-bg">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">ID Staf</span>
                <span className="stat-value">{(userData as Staf).id_staf}</span>
              </div>
            </div>
            {/* Sisanya untuk staf disesuaikan polanya */}
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Maskapai</span>
                <span className="stat-value">{(userData as Staf).nama_maskapai}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Klaim Menunggu</span>
                <span className="stat-value text-warning">{stats.klaim_menunggu}</span>
              </div>
            </div>
            <div className="stat-card">
               <div className="stat-info">
                <span className="stat-label">Klaim Disetujui</span>
                <span className="stat-value text-success">{stats.klaim_disetujui}</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* CARD 3: TRANSAKSI TERBARU (DIRENDER RATA KIRI) */}
      {!isStaf && (
        <section className="dashboard-section card">
          <h3 className="section-title">5 Transaksi Terbaru</h3>
          <div className="transaction-list">
            {recentTransactions.map((trx) => (
              <div key={trx.id} className="transaction-item">
                <div className="trx-left-group">
                  <span className="trx-badge">{trx.type}</span>
                  <span className="trx-date">{trx.waktu}</span>
                </div>
                <span className={`trx-miles ${trx.miles > 0 ? 'positive' : 'negative'}`}>
                  {trx.miles > 0 ? `+${trx.miles.toLocaleString()}` : trx.miles.toLocaleString()} miles
                </span>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="no-data">Belum ada transaksi.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}