import { useState } from 'react';
import type { AwardMilesPackage, Member } from '../types';
import { MOCK_PACKAGES } from '../data/mockData';
import { supabase } from '@/supabase'; 
import './PurchasePage.css';

interface PurchasePageProps {
  member: Member;
}

export default function PurchasePage({ member }: PurchasePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<AwardMilesPackage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleOpenModal = (pkg: AwardMilesPackage) => {
    setSelectedPkg(pkg);
    setIsModalOpen(true);
  };

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    setIsSubmitting(true);

    const { error } = await supabase.rpc('insert_purchase_rpc', {
      p_email: member.email,
      p_nama_package: selectedPkg.id_package
    });

    setIsSubmitting(false);

    if (error) {
      alert('Gagal memproses pembelian: ' + error.message);
    } else {
      // 1. Simpen ID-nya dulu biar aman
      const purchasedId = selectedPkg.id_package;
      
      // 2. Tutup modal & bersihin data paket sekarang juga
      setIsModalOpen(false);
      setSelectedPkg(null);

      // 3. Kasih jeda sekejap (100 milidetik) biar modalnya ilang dulu, baru panggil alert
      setTimeout(() => {
        alert(`SUKSES: Pembelian package "${purchasedId}" berhasil diproses!`);
      }, 100);
    }
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
            <div className="package-badge">{pkg.id_package}</div>
            
            <div className="package-miles-amount">{pkg.jumlah_miles.toLocaleString()}</div>
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

      {isModalOpen && selectedPkg && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Konfirmasi Pembelian</h2>
            <div className="confirmation-detail">
              <p>Anda akan membeli paket miles berikut:</p>
              <div className="conf-row">
                <span>Award Miles:</span>
                <span className="text-primary">+{selectedPkg?.jumlah_miles?.toLocaleString()}</span>
              </div>
              <div className="conf-row">
                <span>Harga:</span>
                <span className="text-bold">Rp {selectedPkg?.harga?.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-batal" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Batal</button>
              <button className="btn-confirm" onClick={handlePurchase} disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Konfirmasi Pembelian'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}