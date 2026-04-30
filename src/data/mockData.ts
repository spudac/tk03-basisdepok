// src/data/mockData.ts
import type { Member, Staf, DashboardStats, Transaction } from '../types';
import type { Reward, RedeemHistory } from '../types';
import type { AwardMilesPackage } from '../types';
import type { Tier } from '../types';
import type { TopMember, DetailedTransaction } from '../types';

export const MOCK_MEMBER: Member = {
  email: 'user1@mail.com',
  salutation: 'Mr.',
  first_mid_name: 'Andi',
  last_name: 'Pratama',
  country_code: '62',
  mobile_number: '812111101',
  tanggal_lahir: '1995-01-01',
  kewarganegaraan: 'Indonesia',
  nomor_member: 'M0001',
  tanggal_bergabung: '2025-01-01',
  tier_nama: 'Blue',
  award_miles: 32000,
  total_miles: 45000,
};

export const MOCK_MEMBER_SILVER: Member = {
  ...MOCK_MEMBER,
  email: 'user3@mail.com',
  first_mid_name: 'Citra',
  last_name: 'Lestari',
  salutation: 'Mrs.',
  nomor_member: 'M0003',
  tier_nama: 'Silver',
  award_miles: 1200,
  total_miles: 26000,
};

export const MOCK_STAF: Staf = {
  email: 'staff1@aero.com',
  salutation: 'Mr.',
  first_mid_name: 'Staff',
  last_name: 'One',
  country_code: '62',
  mobile_number: '81234567801',
  tanggal_lahir: '1990-01-01',
  kewarganegaraan: 'Indonesia',
  id_staf: 'S0001',
  kode_maskapai: 'GA',
  nama_maskapai: 'Garuda Indonesia',
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  klaim_menunggu: 12,
  klaim_disetujui: 5,
  klaim_ditolak: 1,
};

export const MOCK_RECENT_TRANSACTIONS_MEMBER: Transaction[] = [
  { id: '1', type: 'Transfer', waktu: '2025-01-15 10:30', miles: -5000 },
  { id: '2', type: 'Redeem', waktu: '2025-01-20 18:00', miles: -3000 },
  { id: '3', type: 'Package', waktu: '2025-03-01 08:30', miles: 10000 },
];

export const MOCK_RECENT_TRANSACTIONS_STAF: Transaction[] = [];

export const MOCK_REWARDS: Reward[] = [
  {
    kode_hadiah: 'RWD-005',
    nama: 'Upgrade Business Class',
    miles: 15000,
    deskripsi: 'Redeem untuk upgrade dari economy class ke business class',
    valid_start_date: '2020-01-01',
    program_end: '2027-01-01',
    penyedia_nama: 'Garuda Indonesia',
  },
  {
    kode_hadiah: 'RWD-004',
    nama: 'Akses Lounge',
    miles: 2500,
    deskripsi: 'Satu kali akses lounge bandara',
    valid_start_date: '2025-01-01',
    program_end: '2026-12-31',
    penyedia_nama: 'Singapore Airlines',
  },
  {
    kode_hadiah: 'RWD-999',
    nama: 'Voucher Hotel Expired (Tidak boleh tampil)',
    miles: 5000,
    deskripsi: 'Voucher Agoda',
    valid_start_date: '2024-01-01',
    program_end: '2025-12-31', // Sudah expired
    penyedia_nama: 'Agoda',
  }
];

export const MOCK_REDEEM_HISTORY: RedeemHistory[] = [
  {
    id: 'rdm-1',
    waktu: '2025-01-20 18:00',
    hadiah: MOCK_REWARDS[1], // Akses Lounge
    miles_digunakan: -3000, // Di PDF halaman 4 tertulis -3,000
  }
];

export const MOCK_PACKAGES: AwardMilesPackage[] = [
  {
    id_package: 'AMP-001',
    nama: 'Starter Pack',
    deskripsi: 'Tambahan miles',
    harga: 150000,
    jumlah_miles: 1000,
  },
  {
    id_package: 'AMP-002',
    nama: 'Traveler Pack',
    deskripsi: 'Paket liburan',
    harga: 650000,
    jumlah_miles: 5000,
  },
  {
    id_package: 'AMP-003',
    nama: 'Business Pro',
    deskripsi: 'Upgrade class',
    harga: 1200000,
    jumlah_miles: 10000,
  },
  {
    id_package: 'AMP-004',
    nama: 'Platinum Pack',
    deskripsi: 'Miles maksimal',
    harga: 2750000,
    jumlah_miles: 25000,
  },
];

export const MOCK_TIERS: Tier[] = [
  {
    id_tier: 'T-001',
    nama: 'Blue',
    minimal_frekuensi_terbang: 0,
    minimal_tier_miles: 0,
  },
  {
    id_tier: 'T-002',
    nama: 'Silver',
    minimal_frekuensi_terbang: 10,
    minimal_tier_miles: 10000,
  },
  {
    id_tier: 'T-003',
    nama: 'Gold',
    minimal_frekuensi_terbang: 30,
    minimal_tier_miles: 30000,
  },
  {
    id_tier: 'T-004',
    nama: 'Platinum',
    minimal_frekuensi_terbang: 50,
    minimal_tier_miles: 50000,
  },
];

export const MOCK_TOP_MEMBERS_MILES: TopMember[] = [
  { rank: 1, nama: 'John W. Doe', total_miles: 18000, jumlah_transaksi: 5 },
  { rank: 2, nama: 'Jane Smith', total_miles: 5000, jumlah_transaksi: 2 },
  { rank: 3, nama: 'Budi A. Santoso', total_miles: 2500, jumlah_transaksi: 3 },
];

export const MOCK_TOP_MEMBERS_ACTIVITY: TopMember[] = [
  { rank: 1, nama: 'Budi A. Santoso', total_miles: 2500, jumlah_transaksi: 12 },
  { rank: 2, nama: 'John W. Doe', total_miles: 18000, jumlah_transaksi: 8 },
  { rank: 3, nama: 'Siti Aminah', total_miles: 1200, jumlah_transaksi: 7 },
];

export const MOCK_ALL_TRANSACTIONS: DetailedTransaction[] = [
  { id: 'TX001', nama_member: 'John W. Doe', miles: -5000, waktu: '2025-01-15 10:30', tipe: 'Transfer' },
  { id: 'TX002', nama_member: 'John W. Doe', miles: -3000, waktu: '2025-01-20 16:00', tipe: 'Redeem' },
  { id: 'TX003', nama_member: 'Jane Smith', miles: 5000, waktu: '2025-02-01 09:15', tipe: 'Package' },
  { id: 'TX004', nama_member: 'Budi A. Santoso', miles: 2500, waktu: '2025-02-05 11:45', tipe: 'Klaim' },
  { id: 'TX005', nama_member: 'Budi A. Santoso', miles: -2000, waktu: '2025-02-10 14:00', tipe: 'Transfer' },
];