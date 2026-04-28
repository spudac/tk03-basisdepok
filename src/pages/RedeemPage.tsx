import { useState } from 'react';
import type { Member, Reward, RedeemHistory } from '../types';
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
    
    // Validasi miles mencukupi
    if (member.award_miles < selectedReward.miles) {
      alert('Award miles tidak mencukupi!');
      return;
    }

    // TODO: Hit API to create Redeem transaction
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
              <div className="reward-badge">
                {reward.kode_hadiah} - {reward.penyedia_nama}
              </div>
              <h3 className="reward-title">{reward.nama}</h3>
              <p className="reward-desc">{reward.deskripsi}</p>
              <p className="reward-miles">{reward.miles.toLocaleString()} miles</p>
              <p className="reward-period">
                Periode: {reward.valid_start_date} - {reward.program_end}
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
              </tr>
            </thead>
            <tbody>
              {MOCK_REDEEM_HISTORY.map((history) => (
                <tr key={history.id}>
                  <td>
                    <div className="history-hadiah-info">
                      <span className="history-hadiah-nama">{history.hadiah.nama}</span>
                      <span className="history-hadiah-kode">{history.hadiah.kode_hadiah}</span>
                    </div>
                  </td>
                  <td>{history.waktu}</td>
                  <td className="history-miles">{history.miles_digunakan.toLocaleString()}</td>
                </tr>
              ))}
              {MOCK_REDEEM_HISTORY.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">Belum ada riwayat redeem.</td>
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
            <h2>Redeem Miles</h2>
            <p>
              Miles akan dipotong sebesar <strong>{selectedReward.miles.toLocaleString()}</strong> untuk reward <strong>{selectedReward.nama}</strong> dengan kode <strong>{selectedReward.kode_hadiah}</strong> dari <strong>{selectedReward.penyedia_nama}</strong>
            </p>
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