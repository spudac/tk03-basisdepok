import React, { useState, useEffect } from 'react';
import './IdentitasPage.css';
import plusIcon from '../assets/Plus.svg';
import editIcon from '../assets/Edit.svg';
import trashIcon from '../assets/Trash.svg';
import { supabase } from "@/supabase";

interface IdentitasPageProps {
  member?: any;
}

interface Identitas {
  nomor: string;
  email_member: string;
  tanggal_habis: string;
  tanggal_terbit: string;
  negara_penerbit: string;
  jenis: string;
}

const IdentitasPage: React.FC<IdentitasPageProps> = () => {
  const [identitasList, setIdentitasList] = useState<Identitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedNomor, setSelectedNomor] = useState('');
  const [formData, setFormData] = useState({
    nomor: '',
    jenis: 'Paspor',
    negara_penerbit: 'Indonesia',
    tanggal_terbit: '',
    tanggal_habis: ''
  });

  const userSession = JSON.parse(sessionStorage.getItem('aeromiles_user') || '{}');
  const userEmail = userSession.email;

  const fetchIdentitas = async () => {
    if (!userEmail) return;
    setLoading(true);
    const { data, error: dbError } = await supabase
      .from('identitas')
      .select('*')
      .eq('email_member', userEmail);
    
    if (dbError) setError(dbError.message);
    else setIdentitasList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchIdentitas();
  }, [userEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData({ nomor: '', jenis: 'Paspor', negara_penerbit: 'Indonesia', tanggal_terbit: '', tanggal_habis: '' });
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => setIsAddModalOpen(false);

  const handleAdd = async () => {
    const { error: insertError } = await supabase.from('identitas').insert([{
      ...formData,
      email_member: userEmail
    }]);
    
    if (!insertError) {
      fetchIdentitas();
      closeAddModal();
    } else {
      alert(insertError.message);
    }
  };

  const openEditModal = (item: Identitas) => {
    setSelectedNomor(item.nomor);
    setFormData({
      nomor: item.nomor,
      jenis: item.jenis,
      negara_penerbit: item.negara_penerbit,
      tanggal_terbit: item.tanggal_terbit,
      tanggal_habis: item.tanggal_habis
    });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEdit = async () => {
    const { error: updateError } = await supabase
      .from('identitas')
      .update({
        jenis: formData.jenis,
        negara_penerbit: formData.negara_penerbit,
        tanggal_terbit: formData.tanggal_terbit,
        tanggal_habis: formData.tanggal_habis
      })
      .eq('nomor', selectedNomor)
      .eq('email_member', userEmail);
      
    if (!updateError) {
      fetchIdentitas();
      closeEditModal();
    } else {
      alert(updateError.message);
    }
  };

  const openDeleteModal = (nomor: string) => {
    setSelectedNomor(nomor);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    const { error: deleteError } = await supabase
      .from('identitas')
      .delete()
      .eq('nomor', selectedNomor)
      .eq('email_member', userEmail);
      
    if (!deleteError) {
      fetchIdentitas();
      closeDeleteModal();
    } else {
      alert(deleteError.message);
    }
  };

  const getStatus = (habis: string) => {
    return new Date(habis) >= new Date() ? 'Aktif' : 'Kadaluarsa';
  };

  if (!userEmail) return <div>No user session found. Please login.</div>;

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
          {loading ? <p>Loading data...</p> : (
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
                {identitasList.length === 0 ? (
                  <tr><td colSpan={7} style={{textAlign: 'center'}}>Belum ada identitas.</td></tr>
                ) : (
                  identitasList.map((item) => (
                    <tr key={item.nomor}>
                      <td className="font-medium text-black">{item.nomor}</td>
                      <td className="text-black">{item.jenis}</td>
                      <td className="text-black">{item.negara_penerbit}</td>
                      <td className="text-black">{item.tanggal_terbit}</td>
                      <td className="text-black">{item.tanggal_habis}</td>
                      <td>
                        <span className={`status-badge ${getStatus(item.tanggal_habis) === 'Aktif' ? 'status-aktif' : 'status-kadaluarsa'}`}>
                          {getStatus(item.tanggal_habis)}
                        </span>
                      </td>
                      <td className="aksi-cell">
                        <button className="btn-icon" onClick={() => openEditModal(item)}><img src={editIcon} alt="Edit" /></button>
                        <button className="btn-icon" onClick={() => openDeleteModal(item.nomor)}><img src={trashIcon} alt="Hapus" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
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
              <input type="text" name="nomor" value={formData.nomor} onChange={handleInputChange} placeholder="Ex: P1024" />
            </div>

            <div className="form-group">
              <label>Jenis Dokumen</label>
              <select name="jenis" value={formData.jenis} onChange={handleInputChange}>
                <option value="SIM">SIM</option>
                <option value="Paspor">Paspor</option>
                <option value="KTP">KTP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Negara Penerbit</label>
              <select name="negara_penerbit" value={formData.negara_penerbit} onChange={handleInputChange}>
                <option value="Indonesia">Indonesia</option>
                <option value="Argentina">Argentina</option>
                <option value="Jepang">Jepang</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Terbit</label>
                <input type="date" name="tanggal_terbit" value={formData.tanggal_terbit} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Tanggal Habis</label>
                <input type="date" name="tanggal_habis" value={formData.tanggal_habis} onChange={handleInputChange} />
              </div>
            </div>

            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={handleAdd}>Simpan</button>
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
              <input type="text" name="nomor" value={formData.nomor} disabled style={{ backgroundColor: '#f0f0f0' }} />
            </div>

            <div className="form-group">
              <label>Jenis Dokumen</label>
              <select name="jenis" value={formData.jenis} onChange={handleInputChange}>
                <option value="SIM">SIM</option>
                <option value="Paspor">Paspor</option>
                <option value="KTP">KTP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Negara Penerbit</label>
              <select name="negara_penerbit" value={formData.negara_penerbit} onChange={handleInputChange}>
                <option value="Indonesia">Indonesia</option>
                <option value="Argentina">Argentina</option>
                <option value="Jepang">Jepang</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Terbit</label>
                <input type="date" name="tanggal_terbit" value={formData.tanggal_terbit} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Tanggal Habis</label>
                <input type="date" name="tanggal_habis" value={formData.tanggal_habis} onChange={handleInputChange} />
              </div>
            </div>

            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={handleEdit}>Simpan</button>
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
              Apakah Anda yakin ingin menghapus identitas <b>{selectedNomor}</b>? Tindakan ini tidak dapat dibatalkan.
            </div>

            <div className="modal-actions-right">
              <button className="btn-batal" onClick={closeDeleteModal}>Batal</button>
              <button className="btn-hapus" onClick={handleDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentitasPage;