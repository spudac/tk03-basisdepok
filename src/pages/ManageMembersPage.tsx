import React, { useState } from 'react';
import './ManageMembersPage.css';
import plusIcon from '../assets/Plus.svg';
import editIcon from '../assets/Edit.svg';
import trashIcon from '../assets/Trash.svg';
import dropdownIcon from '../assets/Dropdown.svg';

const MOCK_MEMBERS = [
  { no: 'M0001', nama: 'Mr John William Doe', email: 'john@example.gmail.com', tier: 'Plat.', miles: '55,000', award: '32,000', bergabung: '2024-01-15' },
  { no: 'M0002', nama: 'Ms Jane Elizabeth Smith', email: 'jane.smith@example.com', tier: 'Gold', miles: '20,000', award: '15,000', bergabung: '2024-02-20' },
  { no: 'M0003', nama: 'Dr. Alex Robert Johnson', email: 'alex.j@samplemail.com', tier: 'Silver', miles: '5,000', award: '3,500', bergabung: '2024-03-10' },
  { no: 'M0004', nama: 'Mrs. Emily Anne Brown', email: 'emily.brown@example.org', tier: 'Blue', miles: '0', award: '0', bergabung: '2024-04-05' },
];

const ManageMembersPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="manage-members-wrapper">
      <div className="manage-members-page">
        <div className="mm-header-section">
          <div className="mm-title-row">
            <h1>Kelola Member</h1>
            <button className="btn-add-member" onClick={() => setIsAddModalOpen(true)}>
              <img src={plusIcon} alt="Tambah" />
              Tambahkan Member
            </button>
          </div>
          <div className="mm-filter-row">
            <div className="mm-search-input">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Cari Info Member" />
            </div>
            <button className="btn-tier-filter">
              All Tiers
              <img src={dropdownIcon} alt="Dropdown" />
            </button>
          </div>
        </div>

        <div className="mm-card">
          <table className="mm-table">
            <thead>
              <tr>
                <th>No Member</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Total Miles</th>
                <th>Award Miles</th>
                <th>Bergabung</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MEMBERS.map((m, i) => (
                <tr key={i}>
                  <td className="text-black font-medium">{m.no}</td>
                  <td className="text-black">{m.nama}</td>
                  <td className="text-black">{m.email}</td>
                  <td>
                    <span className={`tier-badge tier-${m.tier.replace('.', '').toLowerCase()}`}>
                      {m.tier}
                    </span>
                  </td>
                  <td className="text-black">{m.miles}</td>
                  <td className="text-black">{m.award}</td>
                  <td className="text-black">{m.bergabung}</td>
                  <td className="mm-aksi-cell">
                    <button className="btn-icon" onClick={() => setIsEditModalOpen(true)}><img src={editIcon} alt="Edit" /></button>
                    <button className="btn-icon" onClick={() => setIsDeleteModalOpen(true)}><img src={trashIcon} alt="Hapus" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          Page 1 of 1
        </div>
      </div>

      {/* MODAL TAMBAH */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="mm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tambah Member Baru</h2>
              <button className="btn-close" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            
            <div className="form-row">
              <div className="form-group"><label>Email</label><input type="email" /></div>
              <div className="form-group"><label>Password</label><input type="password" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Salutation</label>
                <select defaultValue="Mr.">
                  <option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option>
                </select>
              </div>
              <div></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Nama Depan</label><input type="text" /></div>
              <div></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Nama Belakang</label><input type="text" /></div>
              <div className="form-group"><label>Kewarganegaraan</label>
                <select defaultValue="Indonesia"><option>Indonesia</option></select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Country Code</label>
                <select defaultValue="+62"><option>+62</option></select>
              </div>
              <div className="form-group"><label>Nomor HP</label><input type="text" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Tanggal Lahir</label><input type="date" defaultValue="1976-01-12" /></div>
              <div></div>
            </div>

            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={() => setIsAddModalOpen(false)}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="mm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Member</h2>
              <button className="btn-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            
            <div className="form-row">
              <div className="form-group"><label>Salutation</label>
                <select defaultValue="Mr.">
                  <option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option>
                </select>
              </div>
              <div></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Nama Depan</label><input type="text" defaultValue="John" /></div>
              <div className="form-group"><label>Nama Tengah</label><input type="text" defaultValue="William" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Nama Belakang</label><input type="text" defaultValue="Doe" /></div>
              <div className="form-group"><label>Kewarganegaraan</label>
                <select defaultValue="Indonesia"><option>Indonesia</option></select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Country Code</label>
                <select defaultValue="+62"><option>+62</option></select>
              </div>
              <div className="form-group"><label>Nomor HP</label><input type="text" defaultValue="81234567890" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Tanggal Lahir</label><input type="date" defaultValue="1990-05-15" /></div>
              <div className="form-group"><label>Tier</label>
                <select defaultValue="Gold">
                  <option>Blue</option><option>Silver</option><option>Gold</option><option>Plat.</option>
                </select>
              </div>
            </div>

            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={() => setIsEditModalOpen(false)}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS KONFIRMASI */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="mm-modal-box-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Konfirmasi Hapus</h2>
              <button className="btn-close" onClick={() => setIsDeleteModalOpen(false)}>✕</button>
            </div>
            
            <div className="confirmation-text">
              Apakah Anda yakin ingin menghapus member ini? Tindakan ini tidak dapat dibatalkan.
            </div>

            <div className="modal-actions-right" style={{gap: '12px'}}>
              <button className="btn-batal" onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
              <button className="btn-hapus" onClick={() => setIsDeleteModalOpen(false)}>Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageMembersPage;
