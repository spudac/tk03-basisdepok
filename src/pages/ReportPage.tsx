// src/pages/ReportPage.tsx
import { useState } from 'react';
import { 
  MOCK_TOP_MEMBERS_MILES, 
  MOCK_TOP_MEMBERS_ACTIVITY, 
  MOCK_ALL_TRANSACTIONS 
} from '../data/mockData';
import './ReportPage.css';

type FilterType = 'Semua' | 'Transfer' | 'Redeem' | 'Package' | 'Klaim';

export default function ReportPage() {
  const [filter, setFilter] = useState<FilterType>('Semua');

  const filteredTransactions = filter === 'Semua' 
    ? MOCK_ALL_TRANSACTIONS 
    : MOCK_ALL_TRANSACTIONS.filter(t => t.tipe === filter);

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Laporan & Riwayat Transaksi Miles</h1>
        <p>Pantau aktivitas member dan statistik transaksi maskapai.</p>
      </div>

      {/* SECTION TOP MEMBER */}
      <div className="top-member-section">
        <div className="report-card">
          <h3 className="card-title">Top Member berdasarkan Total Miles</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Member</th>
                <th>Total Miles</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_MEMBERS_MILES.map((m) => (
                <tr key={m.rank}>
                  <td>{m.rank}</td>
                  <td className="font-bold">{m.nama}</td>
                  <td className="text-primary">{m.total_miles.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="report-card">
          <h3 className="card-title">Top Member Paling Aktif (Transfer/Redeem)</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Member</th>
                <th>Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_MEMBERS_ACTIVITY.map((m) => (
                <tr key={m.rank}>
                  <td>{m.rank}</td>
                  <td className="font-bold">{m.nama}</td>
                  <td className="text-warning">{m.jumlah_transaksi} Transaksi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION RIWAYAT TRANSAKSI DENGAN FILTER */}
      <div className="transaction-report-section">
        <div className="report-card full-width">
          <div className="card-header-flex">
            <h3 className="card-title">Riwayat Transaksi Keseluruhan</h3>
            <div className="filter-group">
              <label>Filter Tipe:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="filter-select"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Transfer">Transfer</option>
                <option value="Redeem">Redeem</option>
                <option value="Package">Package</option>
                <option value="Klaim">Klaim</option>
              </select>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Tipe</th>
                <th>Member</th>
                <th>Miles</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((trx) => (
                <tr key={trx.id}>
                  <td>
                    <span className={`type-badge badge-${trx.tipe.toLowerCase()}`}>
                      {trx.tipe}
                    </span>
                  </td>
                  <td className="font-bold">{trx.nama_member}</td>
                  <td className={trx.miles < 0 ? 'text-danger' : 'text-success'}>
                    {trx.miles > 0 ? `+${trx.miles.toLocaleString()}` : trx.miles.toLocaleString()}
                  </td>
                  <td className="text-muted">{trx.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}