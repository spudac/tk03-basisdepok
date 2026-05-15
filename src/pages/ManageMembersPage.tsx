import React, { useState, useEffect } from 'react';
import './ManageMembersPage.css';
import plusIcon from '../assets/Plus.svg';
import editIcon from '../assets/Edit.svg';
import trashIcon from '../assets/Trash.svg';
import dropdownIcon from '../assets/Dropdown.svg';
import { supabase } from '@/supabase';

interface Member {
  nomor_member: string;
  tanggal_bergabung: string;
  award_miles: number;
  total_miles: number;
  pengguna: {
    email: string;
    salutation: string;
    first_mid_name: string;
    last_name: string;
    country_code: string;
    mobile_number: string;
    tanggal_lahir: string;
    kewarganegaraan: string;
  };
  tier: {
    nama: string;
  };
}

const TIER_MAP: Record<string, string> = {
  'Blue': 'T01',
  'Silver': 'T02',
  'Gold': 'T03',
  'Platinum': 'T04',
  'Plat.': 'T04'
};

const ManageMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({
    salutation: '',
    first_mid_name: '',
    last_name: '',
    kewarganegaraan: '',
    country_code: '',
    mobile_number: '',
    tanggal_lahir: '',
    id_tier: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('member')
      .select(`
        nomor_member,
        tanggal_bergabung,
        award_miles,
        total_miles,
        pengguna (
          email,
          salutation,
          first_mid_name,
          last_name,
          country_code,
          mobile_number,
          tanggal_lahir,
          kewarganegaraan
        ),
        tier (
          nama
        )
      `)
      .order('nomor_member');

    if (error) {
      console.error('Error fetching members:', error);
    } else {
      setMembers(data as unknown as Member[]);
    }
    setLoading(false);
  };

  const openDeleteModal = (email: string) => {
    setSelectedEmail(email);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setEditForm({
      salutation: member.pengguna.salutation,
      first_mid_name: member.pengguna.first_mid_name,
      last_name: member.pengguna.last_name,
      kewarganegaraan: member.pengguna.kewarganegaraan,
      country_code: member.pengguna.country_code,
      mobile_number: member.pengguna.mobile_number,
      tanggal_lahir: member.pengguna.tanggal_lahir,
      id_tier: TIER_MAP[member.tier.nama] || 'T01'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingMember) return;
    const targetEmail = editingMember.pengguna.email;

    const { error: errPengguna } = await supabase
      .from('pengguna')
      .update({
        salutation: editForm.salutation,
        first_mid_name: editForm.first_mid_name,
        last_name: editForm.last_name,
        kewarganegaraan: editForm.kewarganegaraan,
        country_code: editForm.country_code,
        mobile_number: editForm.mobile_number,
        tanggal_lahir: editForm.tanggal_lahir
      })
      .eq('email', targetEmail);

    if (errPengguna) {
      console.error('Error update pengguna:', errPengguna);
      return;
    }

    const { error: errMember } = await supabase
      .from('member')
      .update({ id_tier: editForm.id_tier })
      .eq('email', targetEmail);

    if (errMember) {
      console.error('Error update member:', errMember);
      return;
    }

    setIsEditModalOpen(false);
    fetchMembers();
  };

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
              {loading ? (
                <tr><td colSpan={8}>Loading...</td></tr>
              ) : members.map((m, i) => (
                <tr key={i}>
                  <td className="text-black font-medium">{m.nomor_member}</td>
                  <td className="text-black">{m.pengguna.salutation} {m.pengguna.first_mid_name} {m.pengguna.last_name}</td>
                  <td className="text-black">{m.pengguna.email}</td>
                  <td>
                    <span className={`tier-badge tier-${m.tier.nama.replace('.', '').toLowerCase()}`}>
                      {m.tier.nama}
                    </span>
                  </td>
                  <td className="text-black">{m.total_miles.toLocaleString()}</td>
                  <td className="text-black">{m.award_miles.toLocaleString()}</td>
                  <td className="text-black">{m.tanggal_bergabung}</td>
                  <td className="mm-aksi-cell">
                    <button className="btn-icon" onClick={() => openEditModal(m)}><img src={editIcon} alt="Edit" /></button>
                    <button className="btn-icon" onClick={() => openDeleteModal(m.pengguna.email)}><img src={trashIcon} alt="Hapus" /></button>
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

      {/* MODAL TAMBAH (Unchanged for brevity) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="mm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tambah Member Baru</h2>
              <button className="btn-close" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            {/* Form placeholders... */}
            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={() => setIsAddModalOpen(false)}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isEditModalOpen && editingMember && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="mm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Member</h2>
              <button className="btn-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            
            <div className="form-row">
              <div className="form-group"><label>Salutation</label>
                <select 
                  value={editForm.salutation} 
                  onChange={e => setEditForm({...editForm, salutation: e.target.value})}
                >
                  <option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option>
                </select>
              </div>
              <div></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Nama Depan/Tengah</label>
                <input 
                  type="text" 
                  value={editForm.first_mid_name} 
                  onChange={e => setEditForm({...editForm, first_mid_name: e.target.value})}
                />
              </div>
              <div></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Nama Belakang</label>
                <input 
                  type="text" 
                  value={editForm.last_name} 
                  onChange={e => setEditForm({...editForm, last_name: e.target.value})}
                />
              </div>
              <div className="form-group"><label>Kewarganegaraan</label>
                <select 
                  value={editForm.kewarganegaraan}
                  onChange={e => setEditForm({...editForm, kewarganegaraan: e.target.value})}
                >
                  <option value="Indonesia">Indonesia</option>
                  <option value="USA">USA</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Country Code</label>
                <select 
                  value={editForm.country_code}
                  onChange={e => setEditForm({...editForm, country_code: e.target.value})}
                >
                  <option value="62">+62</option>
                  <option value="1">+1</option>
                  <option value="65">+65</option>
                </select>
              </div>
              <div className="form-group"><label>Nomor HP</label>
                <input 
                  type="text" 
                  value={editForm.mobile_number}
                  onChange={e => setEditForm({...editForm, mobile_number: e.target.value})}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Tanggal Lahir</label>
                <input 
                  type="date" 
                  value={editForm.tanggal_lahir}
                  onChange={e => setEditForm({...editForm, tanggal_lahir: e.target.value})}
                />
              </div>
              <div className="form-group"><label>Tier</label>
                <select 
                  value={editForm.id_tier}
                  onChange={e => setEditForm({...editForm, id_tier: e.target.value})}
                >
                  <option value="T01">Blue</option>
                  <option value="T02">Silver</option>
                  <option value="T03">Gold</option>
                  <option value="T04">Platinum</option>
                </select>
              </div>
            </div>

            <div className="modal-actions-right">
              <button className="btn-simpan" onClick={handleUpdate}>Simpan</button>
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
              <button className="btn-hapus" onClick={() => {
                // Delete logic here
                setIsDeleteModalOpen(false);
              }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageMembersPage;