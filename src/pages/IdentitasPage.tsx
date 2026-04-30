import React, { useState } from 'react';
import './IdentitasPage.css';
import plusIcon from '../assets/Plus.svg';
import editIcon from '../assets/Edit.svg';
import trashIcon from '../assets/Trash.svg';

interface IdentitasPageProps {
  member?: any;
}

const MOCK_IDENTITAS = [
  { noDokumen: 'A123456789', jenis: 'Paspor', negara: 'Argentina', terbit: '2020-03-26', habis: '2049-04-26', status: 'Aktif' },
  { noDokumen: 'A123456789', jenis: 'Paspor', negara: 'Argentina', terbit: '2020-03-26', habis: '2049-04-26', status: 'Kadaluarsa' },
];

const IdentitasPage: React.FC<IdentitasPageProps> = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <div className="identitas-wrapper">
      <div className="identitas-page">
        <div className="identitas-header">
          <h1>Identitas Saya</h1>
          <button className="btn-add-identitas" onClick={openAddModal}>
            <img src={plusIcon} alt="Tambah" />
            Tambahkan Identitas
          </button>
        </div>

        <div className="identitas-card">
          <table className="identitas-table">
            <thead>
              <tr>
                <th>No Dokumen</th>
                <th>Jenis</th>
                <th>Negara</th>
                <th>Terbit</th>
                <th>Habis</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_IDENTITAS.map((item, index) => (
                <tr key={index}>
                  <td className="font-medium text-black">{item.noDokumen}</td>
                  <td className="text-black">{item.jenis}</td>
                  <td className="text-black">{item.negara}</td>
                  <td className="text-black">{item.terbit}</td>
                  <td className="text-black">{item.habis}</td>
                  <td>
                    <span className={`status-badge ${item.status === 'Aktif' ? 'status-aktif' : 'status-kadaluarsa'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="aksi-cell">
                    <button className="btn-icon" onClick={openEditModal}><img src={editIcon} alt="Edit" /></button>
                    <button className="btn-icon" onClick={openDeleteModal}><img src={trashIcon} alt="Hapus" /></button>
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
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="identitas-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tambah Identitas Baru</h2>
              <button className="btn-close" onClick={closeAddModal}>✕</button>
            </div>
            
            <div className="form-group">
              <label>Nomor Dokumen</label>
              <input type="text" defaultValue="SIM0001" />
            </div>

            <div className="form-group">
              <label>Jenis Dokumen</label>
              <select defaultValue="SIM">
                <option value="SIM">SIM</option>
                <option value="Paspor">Paspor</option>
                <option value="KTP">KTP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Negara Penerbit</label>
              <select defaultValue="Indonesia">
                <option value="Indonesia">Indonesia</option>
                <option value="Argentina">Argentina</option>
                <option value="Jepang">Jepang</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Terbit</label>
                <input type="date" defaultValue="2026-04-12" />
              </div>
              <div className="form-group">
                <label>Tanggal Habis</label>
                <input type="date" defaultValue="2031-04-12" />
              </div>
            </div>

            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={closeAddModal}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="identitas-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Identitas</h2>
              <button className="btn-close" onClick={closeEditModal}>✕</button>
            </div>
            
            <div className="form-group">
              <label>Nomor Dokumen</label>
              <input type="text" defaultValue="SIM0001" />
            </div>

            <div className="form-group">
              <label>Jenis Dokumen</label>
              <select defaultValue="SIM">
                <option value="SIM">SIM</option>
                <option value="Paspor">Paspor</option>
                <option value="KTP">KTP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Negara Penerbit</label>
              <select defaultValue="Indonesia">
                <option value="Indonesia">Indonesia</option>
                <option value="Argentina">Argentina</option>
                <option value="Jepang">Jepang</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Terbit</label>
                <input type="date" defaultValue="2026-04-12" />
              </div>
              <div className="form-group">
                <label>Tanggal Habis</label>
                <input type="date" defaultValue="2031-04-25" />
              </div>
            </div>

            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={closeEditModal}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS KONFIRMASI */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="identitas-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Konfirmasi Hapus</h2>
              <button className="btn-close" onClick={closeDeleteModal}>✕</button>
            </div>
            
            <div className="confirmation-text">
              Apakah Anda yakin ingin menghapus identitas ini? Tindakan ini tidak dapat dibatalkan.
            </div>

            <div className="modal-actions-right">
              <button className="btn-batal" onClick={closeDeleteModal}>Batal</button>
              <button className="btn-hapus" onClick={closeDeleteModal}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentitasPage;
