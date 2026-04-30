// src/pages/PurchasePage.tsx
import { useState } from 'react';
import type { AwardMilesPackage, Member } from '../types';
import { MOCK_PACKAGES } from '../data/mockData';
import './PurchasePage.css';

// Tambahkan prop member untuk mengambil saldo miles saat ini
interface PurchasePageProps {
  member: Member;
}

export default function PurchasePage({ member }: PurchasePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<AwardMilesPackage | null>(null);

  const handleOpenModal = (pkg: AwardMilesPackage) => {
    setSelectedPkg(pkg);
    setIsModalOpen(true);
  };

  const handlePurchase = () => {
    alert(`Pembelian ${selectedPkg?.id_package} berhasil diproses!`);
    setIsModalOpen(false);
  };

  return (
    <div className="purchase-container">
      <div className="purchase-header">
        <h1>Beli Award Miles Package</h1>
        <p>Award Miles saat ini: <strong>{member.award_miles.toLocaleString()}</strong></p>
      </div>

      <div className="package-grid">
        {MOCK_PACKAGES.map((pkg) => (
          <div key={pkg.id_package} className="package-card">
            {/* Badge ID Paket di pojok kanan */}
            <div className="package-badge">{pkg.id_package}</div>
            
            {/* Ikon Keranjang */}
            <div className="package-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            
            <div className="package-miles">{pkg.jumlah_miles.toLocaleString()}</div>
            <div className="package-miles-label">Award Miles</div>
            
            <div className="package-price">
              Rp {pkg.harga.toLocaleString('id-ID')}
            </div>
            
            <button className="btn-buy" onClick={() => handleOpenModal(pkg)}>
              Beli
            </button>
          </div>
        ))}
      </div>

      {/* Modal Konfirmasi Pembelian */}
      {isModalOpen && selectedPkg && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Konfirmasi Pembelian</h2>
            <div className="confirmation-detail">
              <p>Anda akan membeli paket miles berikut:</p>
              <div className="conf-row">
                <span>Award Miles:</span>
                <span className="text-primary">+{selectedPkg.jumlah_miles.toLocaleString()}</span>
              </div>
              <div className="conf-row">
                <span>Harga:</span>
                <span className="text-bold">Rp {selectedPkg.harga.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-batal" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button className="btn-confirm" onClick={handlePurchase}>Konfirmasi Pembelian</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}