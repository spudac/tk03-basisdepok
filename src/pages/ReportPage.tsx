import { useState, useEffect } from 'react';
import './ReportPage.css';
import { supabase } from '@/supabase';
 
// Types
 
type ViewMode   = 'transaksi' | 'topMember';
type FilterType = 'Semua Tipe' | 'Transfer' | 'Redeem' | 'Package' | 'Klaim';
 
interface Transaction {
  id: string;
  tipe: 'Transfer' | 'Redeem' | 'Package' | 'Klaim';
  email_member: string;
  nama_member: string;
  miles: number;
  waktu: string;
}
 
interface TopMember {
  peringkat: number;
  email: string;
  nama_lengkap: string;
  nomor_member: string;
  nama_tier: string;
  total_miles: number;
  award_miles: number;
}
 
interface SummaryStats {
  totalMiles: number;
  totalRedeem: number;
  totalKlaimDisetujui: number;
}
 
// Main Component 
 
export default function ReportPage() {
  const [viewMode,   setViewMode]   = useState<ViewMode>('transaksi');
  const [filterType, setFilterType] = useState<FilterType>('Semua Tipe');
 
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [topMembers,   setTopMembers]   = useState<TopMember[]>([]);
  const [summary,      setSummary]      = useState<SummaryStats>({ totalMiles: 0, totalRedeem: 0, totalKlaimDisetujui: 0 });
 
  const [loadingTrx, setLoadingTrx] = useState(true);
  const [loadingTop, setLoadingTop] = useState(false);
 
  const [toast,       setToast]       = useState({ visible: false, message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trxToDelete, setTrxToDelete] = useState<string | null>(null);
 
  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };
 
  // Summary stats
  const fetchSummary = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
 
    const [{ data: milesData }, { count: redeemCount }, { count: klaimCount }] = await Promise.all([
      supabase.from('member').select('total_miles'),
      supabase.from('redeem').select('*', { count: 'exact', head: true }).gte('timestamp', startOfMonth.toISOString()),
      supabase.from('claim_missing_miles').select('*', { count: 'exact', head: true }).eq('status_penerimaan', 'Disetujui'),
    ]);
 
    setSummary({
      totalMiles:          (milesData ?? []).reduce((s: number, r: any) => s + (r.total_miles ?? 0), 0),
      totalRedeem:         redeemCount ?? 0,
      totalKlaimDisetujui: klaimCount  ?? 0,
    });
  };
 
  // Transactions
  const fetchTransactions = async () => {
    setLoadingTrx(true);
    const all: Transaction[] = [];
 
    // Transfer 
    const { data: transfers } = await supabase
      .from('transfer')
      .select(`
        email_member_1, email_member_2, timestamp, jumlah,
        member!transfer_email_member_2_fkey ( pengguna ( first_mid_name, last_name ) )
      `)
      .order('timestamp', { ascending: false })
      .limit(50);
 
    (transfers ?? []).forEach((row: any, i: number) => {
      all.push({
        id: `transfer-${i}`,
        tipe: 'Transfer',
        email_member: row.email_member_2,
        nama_member: row.member?.pengguna ? `${row.member.pengguna.first_mid_name} ${row.member.pengguna.last_name}` : row.email_member_2,
        miles: row.jumlah,
        waktu: row.timestamp,
      });
    });
 
    // Redeem
    const { data: redeems } = await supabase
      .from('redeem')
      .select(`
      email_member, timestamp,
      hadiah ( miles ),
      member!redeem_email_member_fkey ( pengguna ( first_mid_name, last_name ) )
      `)
      .order('timestamp', { ascending: false })
      .limit(50);
 
    (redeems ?? []).forEach((row: any, i: number) => {
      all.push({
        id: `redeem-${i}`,
        tipe: 'Redeem',
        email_member: row.email_member,
        nama_member: row.member?.pengguna ? `${row.member.pengguna.first_mid_name} ${row.member.pengguna.last_name}` : row.email_member,
        miles: -(row.hadiah?.miles ?? 0),
        waktu: row.timestamp,
      });
    });
 
    // Award Miles Package
    const { data: packages } = await supabase
      .from('member_award_miles_package')
      .select(`
        email_member, timestamp,
        award_miles_package!member_award_miles_package_id_award_miles_package_fkey ( jumlah_award_miles ),
        member!member_award_miles_package_email_member_fkey ( pengguna ( first_mid_name, last_name ) )
      `)
      .order('timestamp', { ascending: false })
      .limit(50);
 
    (packages ?? []).forEach((row: any, i: number) => {
      all.push({
        id: `package-${i}`,
        tipe: 'Package',
        email_member: row.email_member,
        nama_member: row.member?.pengguna ? `${row.member.pengguna.first_mid_name} ${row.member.pengguna.last_name}` : row.email_member,
        miles: row.award_miles_package?.jumlah_award_miles ?? 0,
        waktu: row.timestamp,
      });
    });
 
    // Klaim Disetujui
    const { data: klaims } = await supabase
      .from('claim_missing_miles')
      .select(`
        id, email_member, timestamp, flight_number,
        member!claim_missing_miles_email_member_fkey ( pengguna ( first_mid_name, last_name ) )
      `)
      .eq('status_penerimaan', 'Disetujui')
      .order('timestamp', { ascending: false })
      .limit(50);
 
    (klaims ?? []).forEach((row: any) => {
      all.push({
        id: `klaim-${row.id}`,
        tipe: 'Klaim',
        email_member: row.email_member,
        nama_member: row.member?.pengguna ? `${row.member.pengguna.first_mid_name} ${row.member.pengguna.last_name}` : row.email_member,
        miles: 1000,
        waktu: row.timestamp,
      });
    });
 
    all.sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());
    setTransactions(all);
    setLoadingTrx(false);
  };
 
  // Top 5 Member 
  const fetchTop5Member = async () => {
    setLoadingTop(true);
    const { data, error } = await supabase.rpc('fn_get_top5_member');
 
    if (error) { console.error('fn_get_top5_member:', error.message); setLoadingTop(false); return; }
 
    const members: TopMember[] = (data ?? []).map((row: any) => ({
      peringkat:    row.peringkat,
      email:        row.email,
      nama_lengkap: row.nama_lengkap,
      nomor_member: row.nomor_member,
      nama_tier:    row.nama_tier,
      total_miles:  row.total_miles,
      award_miles:  row.award_miles,
    }));
 
    setTopMembers(members);
 
    if (members.length > 0) {
      const first = members[0];
      showToast(
        `SUKSES: Daftar Top 5 Member berdasarkan total miles berhasil diperbarui, ` +
        `dengan peringkat pertama "${first.email}" memiliki ${first.total_miles.toLocaleString()} miles.`
      );
    }
    setLoadingTop(false);
  };
 
  useEffect(() => { fetchSummary(); fetchTransactions(); }, []);
  useEffect(() => { if (viewMode === 'topMember') fetchTop5Member(); }, [viewMode]);
 
  // Delete (local state only)
  const handleDeleteClick = (id: string, isDeletable: boolean) => {
    if (!isDeletable) return;
    setTrxToDelete(id);
    setIsModalOpen(true);
  };
  const cancelDelete  = () => { setIsModalOpen(false); setTrxToDelete(null); };
  const confirmDelete = () => {
    if (trxToDelete) {
      setTransactions(transactions.filter(t => t.id !== trxToDelete));
      setIsModalOpen(false); setTrxToDelete(null);
      showToast('Berhasil menghapus riwayat transaksi!');
    }
  };
  const checkDeletable = (miles: number) => miles <= 0;
 
  const displayedTransactions = transactions.filter(trx =>
    filterType === 'Semua Tipe' ? true : trx.tipe === filterType
  );
 
  // Render
 
  return (
    <div className="report-container">
 
      {/* Toast */}
      {toast.visible && (
        <div className="toast-notification">
          <div className="toast-content">
            <div className="toast-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span className="toast-message">{toast.message}</span>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}
 
      {/* Confirm Delete Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Konfirmasi Hapus</h2>
            <div className="confirmation-detail">
              <p>Apakah Anda yakin ingin menghapus riwayat transaksi ini?</p>
            </div>
            <div className="modal-actions">
              <button className="btn-batal" onClick={cancelDelete}>Batal</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
 
      <div className="report-header">
        <h1>Laporan & Riwayat Transaksi</h1>
        <p>Ringkasan performa dan aktivitas miles maskapai Anda.</p>
      </div>
 
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box blue-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Miles Beredar</span>
            <span className="summary-value">{summary.totalMiles.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-box red-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Redeem Bulan Ini</span>
            <span className="summary-value">{summary.totalRedeem} Hadiah</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-box green-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Klaim Disetujui</span>
            <span className="summary-value">{summary.totalKlaimDisetujui} Klaim</span>
          </div>
        </div>
      </div>
 
      {/* Tab Controls */}
      <div className="table-controls-container">
        <div className="segmented-control">
          <button className={`seg-btn ${viewMode === 'transaksi'  ? 'active' : ''}`} onClick={() => setViewMode('transaksi')}>Riwayat Transaksi</button>
          <button className={`seg-btn ${viewMode === 'topMember'  ? 'active' : ''}`} onClick={() => setViewMode('topMember')}>Top Member</button>
        </div>
        {viewMode === 'transaksi' && (
          <select value={filterType} onChange={e => setFilterType(e.target.value as FilterType)} className="filter-dropdown-select">
            <option value="Semua Tipe">Semua Tipe</option>
            <option value="Transfer">Transfer</option>
            <option value="Redeem">Redeem</option>
            <option value="Package">Package</option>
            <option value="Klaim">Klaim</option>
          </select>
        )}
      </div>
 
      {/* Main Table */}
      <div className="main-report-card">
        <table className="report-table">
          {viewMode === 'transaksi' ? (
            <>
              <thead>
                <tr>
                  <th>Tipe</th><th>Member</th><th>Miles</th><th>Waktu</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loadingTrx ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Memuat data...</td></tr>
                ) : displayedTransactions.map(trx => {
                  const isDeletable = checkDeletable(trx.miles);
                  return (
                    <tr key={trx.id}>
                      <td>
                        <div className="type-with-icon">
                          {trx.tipe === 'Transfer' && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M12 18V15"/></svg>}
                          {trx.tipe === 'Redeem'   && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>}
                          {trx.tipe === 'Package'  && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
                          {trx.tipe === 'Klaim'    && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3 3-3-1-2 2 5 2 2 5 2-2-1-3 3-3 5 6 1.2-.7c.4-.2.7-.6.6-1.1Z"/></svg>}
                          <span className="type-text-plain">{trx.tipe}</span>
                        </div>
                      </td>
                      <td>
                        <div className="member-stack">
                          <span className="member-name">{trx.nama_member}</span>
                          <span className="member-email">{trx.email_member}</span>
                        </div>
                      </td>
                      <td className={trx.miles < 0 ? 'text-danger' : 'text-success'}>
                        {trx.miles > 0 ? `+${trx.miles.toLocaleString()}` : trx.miles.toLocaleString()}
                      </td>
                      <td className="text-muted">{new Date(trx.waktu).toLocaleString('id-ID')}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className={`btn-action-delete ${isDeletable ? 'red' : 'gray'}`}
                          onClick={() => handleDeleteClick(trx.id, isDeletable)}
                          title={isDeletable ? 'Hapus Transaksi' : 'Transaksi positif tidak bisa dihapus'}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>No</th>
                  <th>Nama Member</th><th>Tier</th>
                  <th>Total Miles</th><th>Award Miles</th><th>No. Member</th>
                </tr>
              </thead>
              <tbody>
                {loadingTop ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Memuat data...</td></tr>
                ) : topMembers.map(m => (
                  <tr key={m.email}>
                    <td className="text-muted font-bold">{m.peringkat}</td>
                    <td>
                      <div className="member-stack">
                        <span className="member-name">{m.nama_lengkap}</span>
                        <span className="member-email">{m.email}</span>
                      </div>
                    </td>
                    <td>{m.nama_tier}</td>
                    <td className="font-bold">{m.total_miles.toLocaleString()}</td>
                    <td className="font-bold">{m.award_miles.toLocaleString()}</td>
                    <td className="text-muted">{m.nomor_member}</td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  );
}