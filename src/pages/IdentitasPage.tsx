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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    const { data, error } = await supabase.rpc('get_identitas_list', { p_email: userEmail });
    
    if (error) {
      console.error(error);
    } else {
      setIdentitasList(data || []);
    }
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
    setFeedback(null);
    const { data, error } = await supabase.rpc('add_identitas', {
      p_nomor: formData.nomor,
      p_email: userEmail,
      p_tanggal_habis: formData.tanggal_habis,
      p_tanggal_terbit: formData.tanggal_terbit,
      p_negara_penerbit: formData.negara_penerbit,
      p_jenis: formData.jenis
    });
    
    if (error) {
      setFeedback({ type: 'error', text: error.message });
    } else {
      setFeedback({ type: 'success', text: data });
      fetchIdentitas();
      closeAddModal();
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
    setFeedback(null);
    const { data, error } = await supabase.rpc('update_identitas', {
      p_nomor: selectedNomor,
      p_email: userEmail,
      p_tanggal_habis: formData.tanggal_habis,
      p_tanggal_terbit: formData.tanggal_terbit,
      p_negara_penerbit: formData.negara_penerbit,
      p_jenis: formData.jenis
    });
      
    if (error) {
      setFeedback({ type: 'error', text: error.message });
    } else {
      setFeedback({ type: 'success', text: data });
      fetchIdentitas();
      closeEditModal();
    }
  };

  const openDeleteModal = (nomor: string) => {
    setSelectedNomor(nomor);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    setFeedback(null);
    const { data, error } = await supabase.rpc('delete_identitas', {
      p_nomor: selectedNomor,
      p_email: userEmail
    });
      
    if (error) {
      setFeedback({ type: 'error', text: error.message });
    } else {
      setFeedback({ type: 'success', text: data });
      fetchIdentitas();
      closeDeleteModal();
    }
  };

  const getStatus = (habis: string) => {
    return new Date(habis) >= new Date() ? 'Aktif' : 'Kadaluarsa';
  };

  if (!userEmail) return <div>No user session found. Please login.</div>;

  return (
    <div className="identitas-wrapper">
      <div className="identitas-page">

        {/* Feedback Banner */}
        {feedback && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '8px',
            backgroundColor: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'inherit', opacity: 0.7 }}>×</button>
          </div>
        )}

        <div className="identitas-header">
          <h1>Identitas Saya</h1>
          <button className="btn-add-identitas" onClick={openAddModal}>
            <img src={plusIcon} alt="Tambah" />
            Tambahkan Identitas
          </button>
        </div>

        <div className="identitas-card">
          {loading ? <p style={{padding: '20px'}}>Loading data...</p> : (
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
                  <tr><td colSpan={7} style={{textAlign: 'center', padding: '20px'}}>Belum ada identitas.</td></tr>
                ) : (
                  identitasList.map((item) => (
                    <tr key={item.nomor}>
                      <td className="font-medium text-black">{item.nomor}</td>
                      <td className="text-black">{item.jenis}</td>
                      <td className="text-black">{item.negara_penerbit}</td>
                      <td className="text-black">{String(item.tanggal_terbit)}</td>
                      <td className="text-black">{String(item.tanggal_habis)}</td>
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
            
            <div className="confirmation-text" style={{ padding: '20px 0' }}>
              Apakah Anda yakin ingin menghapus identitas <b>{selectedNomor}</b>? Tindakan ini tidak dapat dibatalkan.
            </div>

            <div className="modal-actions-right">
              <button className="btn-batal" onClick={closeDeleteModal} style={{ marginRight: '10px', background: 'transparent', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '8px' }}>Batal</button>
              <button className="btn-hapus" onClick={handleDelete} style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px' }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentitasPage;