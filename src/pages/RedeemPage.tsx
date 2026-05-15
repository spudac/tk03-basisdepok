import { useState } from 'react';
import type { Member, Reward } from '../types';
import { MOCK_REWARDS, MOCK_REDEEM_HISTORY } from '../data/mockData';
import { supabase } from '@/supabase';
import './RedeemPage.css';

interface RedeemPageProps {
  member: Member;
}

export default function RedeemPage({ member }: RedeemPageProps) {
  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const availableRewards = MOCK_REWARDS.filter((reward) => {
    return new Date(reward.program_end) >= today;
  });

  const handleOpenModal = (reward: Reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSelectedReward(null);
  };

  const handleRedeem = async () => {
    if (!selectedReward) return;
    setIsSubmitting(true);
    
    const { error } = await supabase.rpc('insert_redeem_rpc', {
      p_email: member.email,
      p_kode_hadiah: selectedReward.kode_hadiah
    });

    setIsSubmitting(false);

    if (error) {
      alert('Gagal Redeem: ' + error.message);
    } else {
      alert(`SUKSES: Redeem hadiah "${selectedReward.nama}" berhasil diproses!`);
      handleCloseModal();
    }
  };

  return (
    <div className="redeem-container">
      <div className="redeem-header">
        <h1>Redeem Hadiah</h1>
        <p>Tukarkan miles Anda dengan berbagai penawaran menarik.</p>
        <div className="miles-badge">
          Award Miles: <strong>{member.award_miles.toLocaleString()}</strong>
        </div>
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
              <div className="reward-image-placeholder">
                Gambar Hadiah
              </div>
              <div className="reward-info">
                <h3>{reward.nama}</h3>
                <p className="reward-miles">{reward.miles.toLocaleString()} Miles</p>
                <button 
                  className="btn-redeem"
                  onClick={() => handleOpenModal(reward)}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
          {availableRewards.length === 0 && (
            <div className="no-data text-center">Tidak ada hadiah yang tersedia saat ini.</div>
          )}
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="history-section">
          <table className="history-table">
            <thead>
              <tr>
                <th>Kode Hadiah</th>
                <th>Nama Hadiah</th>
                <th>Tanggal Redeem</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REDEEM_HISTORY.map((hist: any, index: number) => (
                <tr key={index}>
                  <td>{hist.kode_hadiah}</td>
                  <td>{hist.nama_hadiah}</td>
                  <td>{hist.tanggal_redeem}</td>
                  <td className="action-cell">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lock-icon">
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

      {isModalOpen && selectedReward && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Konfirmasi Redeem</h2>
            <div className="confirmation-detail">
              <p>
                Miles Anda akan dipotong sebesar <strong>{selectedReward?.miles.toLocaleString()}</strong> untuk hadiah <strong>{selectedReward?.nama}</strong>.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-batal" onClick={handleCloseModal} disabled={isSubmitting}>Batal</button>
              <button className="btn-confirm" onClick={handleRedeem} disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Konfirmasi Redeem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}