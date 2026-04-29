// src/pages/RedeemPage.tsx
import { useState } from 'react';
import type { Member, Reward } from '../types';
import { MOCK_REWARDS, MOCK_REDEEM_HISTORY } from '../data/mockData';
import './RedeemPage.css';

interface RedeemPageProps {
  member: Member;
}

export default function RedeemPage({ member }: RedeemPageProps) {
  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  // Filter: Jangan tampilkan hadiah yang sudah melewati program_end
  const today = new Date();
  const availableRewards = MOCK_REWARDS.filter((reward) => {
    return new Date(reward.program_end) >= today;
  });

  const handleOpenModal = (reward: Reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReward(null);
  };

  const handleRedeem = () => {
    if (!selectedReward) return;
    
    if (member.award_miles < selectedReward.miles) {
      alert('Award miles tidak mencukupi!');
      return;
    }

    alert(`Berhasil redeem ${selectedReward.nama}! (Simulasi)`);
    handleCloseModal();
  };

  return (
    <div className="redeem-container">
      <div className="redeem-header">
        <h1>Redeem Hadiah</h1>
        <p className="award-miles-info">
          Award Miles tersedia: <strong>{member.award_miles.toLocaleString()}</strong>
        </p>
      </div>

      <div className="redeem-tabs-wrapper">
        <button
          className={`redeem-tab ${activeTab === 'katalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('katalog')}
        >
          Katalog Hadiah
        </button>
        <button
          className={`redeem-tab ${activeTab === 'riwayat' ? 'active' : ''}`}
          onClick={() => setActiveTab('riwayat')}
        >
          Riwayat Redeem
        </button>
      </div>

      {activeTab === 'katalog' && (
        <div className="reward-grid">
          {availableRewards.map((reward) => (
            <div key={reward.kode_hadiah} className="reward-card">
              {/* Badge ID & Nama Penyedia */}
              <div className="reward-badge">
                {reward.kode_hadiah} - {reward.penyedia_nama}
              </div>
              
              {/* Detail Info Dirapatkan */}
              <h3 className="reward-title">{reward.nama}</h3>
              <p className="reward-desc">{reward.deskripsi}</p>
              <p className="reward-miles">{reward.miles.toLocaleString()} miles</p>
              
              {/* Format Periode diubah menggunakan double dash (--) */}
              <p className="reward-period">
                Periode: {reward.valid_start_date} -- {reward.program_end}
              </p>
              
              <button 
                className="btn-redeem"
                onClick={() => handleOpenModal(reward)}
              >
                REDEEM
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="history-card">
          <table className="history-table">
            <thead>
              <tr>
                <th>Hadiah</th>
                <th>Waktu</th>
                <th>Miles</th>
                <th style={{ textAlign: 'center', width: '80px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REDEEM_HISTORY.map((history) => (
                <tr key={history.id}>
                  <td>
                    <div className="history-hadiah-info">
                      <span className="history-hadiah-nama">{history.hadiah.nama}</span>
                    </div>
                  </td>
                  <td>{history.waktu}</td>
                  {/* Tambah tanda minus di miles */}
                  <td className="history-miles">-{Math.abs(history.miles_digunakan).toLocaleString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    {/* Icon Gembok (Terkunci) */}
                    <svg className="lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <title>Riwayat tidak dapat dihapus</title>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </td>
                </tr>
              ))}
              {MOCK_REDEEM_HISTORY.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">Belum ada riwayat redeem.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL KONFIRMASI REDEEM */}
      {isModalOpen && selectedReward && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Konfirmasi Redeem</h2>
            <div className="confirmation-detail">
              <p>
                Miles Anda akan dipotong sebesar <strong>{selectedReward.miles.toLocaleString()}</strong> untuk hadiah <strong>{selectedReward.nama}</strong>.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-batal" onClick={handleCloseModal}>Batal</button>
              <button className="btn-confirm" onClick={handleRedeem}>Redeem</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}