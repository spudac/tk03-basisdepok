import { useState } from 'react';
import { 
  MOCK_TOP_MEMBERS_MILES, 
  MOCK_ALL_TRANSACTIONS as INITIAL_TRANSACTIONS 
} from '../data/mockData';
import './ReportPage.css';

type ViewMode = 'transaksi' | 'topMember';
type FilterType = 'Semua Tipe' | 'Transfer' | 'Redeem' | 'Package' | 'Klaim';

export default function ReportPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('transaksi');
  const [filterType, setFilterType] = useState<FilterType>('Semua Tipe');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  
  // State untuk Notifikasi & Modal Popup
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trxToDelete, setTrxToDelete] = useState<string | null>(null);

  // Fungsi Hapus & Popup
  const handleDeleteClick = (id: string, isDeletable: boolean) => {
    if (!isDeletable) return;
    setTrxToDelete(id);
    setIsModalOpen(true);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setTrxToDelete(null);
  };

  const confirmDelete = () => {
    if (trxToDelete) {
      setTransactions(transactions.filter(t => t.id !== trxToDelete));
      setIsModalOpen(false);
      setTrxToDelete(null);
      setToast({ visible: true, message: 'Berhasil menghapus riwayat transaksi!' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    }
  };

  const checkDeletable = (miles: number) => {
    return miles <= 0; 
  };

  // Filter Data Tabel
  const displayedTransactions = transactions.filter(trx => 
    filterType === 'Semua Tipe' ? true : trx.tipe === filterType
  );

  return (
    <div className="report-container">
      {/* NOTIFIKASI TOAST */}
      {toast.visible && (
        <div className="toast-notification">
          <div className="toast-content">
            <div className="toast-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="toast-message">{toast.message}</span>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      {/* POPUP MODAL KONFIRMASI HAPUS */}
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

      {/* 1. GRID RINGKASAN (3 CARD ATAS) */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box blue-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Miles Beredar</span>
            <span className="summary-value">1,240,500</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box red-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Redeem Bulan Ini</span>
            <span className="summary-value">84 Hadiah</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box green-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Klaim Disetujui</span>
            <span className="summary-value">156 Klaim</span>
          </div>
        </div>
      </div>

      {/* KONTROL TAB & FILTER */}
      <div className="table-controls-container">
        <div className="segmented-control">
          <button 
            className={`seg-btn ${viewMode === 'transaksi' ? 'active' : ''}`}
            onClick={() => setViewMode('transaksi')}
          >
            Riwayat Transaksi
          </button>
          <button 
            className={`seg-btn ${viewMode === 'topMember' ? 'active' : ''}`}
            onClick={() => setViewMode('topMember')}
          >
            Top Member
          </button>
        </div>

        {viewMode === 'transaksi' && (
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="filter-dropdown-select"
          >
            <option value="Semua Tipe">Semua Tipe</option>
            <option value="Transfer">Transfer</option>
            <option value="Redeem">Redeem</option>
            <option value="Package">Package</option>
            <option value="Klaim">Klaim</option>
          </select>
        )}
      </div>

      {/* 2. CARD UTAMA */}
      <div className="main-report-card">
        <table className="report-table">
          {viewMode === 'transaksi' ? (
            <>
              <thead>
                <tr>
                  <th>Tipe</th>
                  <th>Member</th>
                  <th>Miles</th>
                  <th>Waktu</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((trx) => {
                  const isDeletable = checkDeletable(trx.miles);
                  return (
                    <tr key={trx.id}>
                      <td>
                        <div className="type-with-icon">
                          {trx.tipe === 'Transfer' && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M12 18V15"/></svg>}
                          {trx.tipe === 'Redeem' && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>}
                          {trx.tipe === 'Package' && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
                          {trx.tipe === 'Klaim' && <svg className="trx-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3 3-3-1-2 2 5 2 2 5 2-2-1-3 3-3 5 6 1.2-.7c.4-.2.7-.6.6-1.1Z"/></svg>}
                          <span className="type-text-plain">{trx.tipe}</span>
                        </div>
                      </td>
                      <td>
                        <div className="member-stack">
                          <span className="member-name">{trx.nama_member}</span>
                          <span className="member-email">{trx.nama_member.toLowerCase().replace(/\s/g, '')}@example.com</span>
                        </div>
                      </td>
                      <td className={trx.miles < 0 ? 'text-danger' : 'text-success'}>
                        {trx.miles > 0 ? `+${trx.miles.toLocaleString()}` : trx.miles.toLocaleString()}
                      </td>
                      <td className="text-muted">{trx.waktu}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className={`btn-action-delete ${isDeletable ? 'red' : 'gray'}`}
                          onClick={() => handleDeleteClick(trx.id, isDeletable)}
                          title={isDeletable ? "Hapus Transaksi" : "Transaksi positif tidak bisa dihapus"}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
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
                  <th>Nama Member</th>
                  <th>Total Miles</th>
                  <th>Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TOP_MEMBERS_MILES.map((m, index) => (
                  <tr key={index}>
                    <td className="text-muted font-bold">{index + 1}</td>
                    <td>
                      <div className="member-stack">
                        <span className="member-name">{m.nama}</span>
                        <span className="member-email">{m.nama.toLowerCase().replace(/\s/g, '')}@example.com</span>
                      </div>
                    </td>
                    <td className="font-bold">{m.total_miles.toLocaleString()}</td>
                    <td className="font-bold text-black">{m.jumlah_transaksi}</td>
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