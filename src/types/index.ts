// src/types.ts

export type Role = 'guest' | 'member' | 'staf';

export interface Pengguna {
  email: string;
  salutation: string;
  first_mid_name: string;
  last_name: string;
  country_code: string;
  mobile_number: string;
  tanggal_lahir: string;
  kewarganegaraan: string;
}

export interface Member extends Pengguna {
  nomor_member: string;
  tanggal_bergabung: string;
  tier_nama: string;
  award_miles: number;
  total_miles: number;
}

export interface Staf extends Pengguna {
  id_staf: string;
  kode_maskapai: string;
  nama_maskapai: string;
}

export interface Transaction {
  id: string;
  type: 'Transfer' | 'Redeem' | 'Package' | 'Klaim';
  waktu: string;
  miles: number;
}

export interface DashboardStats {
  klaim_menunggu: number;
  klaim_disetujui: number;
  klaim_ditolak: number;
}

export interface Reward {
  kode_hadiah: string;
  nama: string;
  miles: number;
  deskripsi: string;
  valid_start_date: string;
  program_end: string;
  penyedia_nama: string; // Didapat dari join tabel maskapai/mitra
}

export interface RedeemHistory {
  id: string; // ID unik untuk frontend (karena tabel redeem pakai composite key)
  waktu: string;
  hadiah: Reward;
  miles_digunakan: number;
}

export interface AwardMilesPackage {
  id_package: string;
  nama: string;
  deskripsi: string;
  harga: number;
  jumlah_miles: number;
}

export interface PurchaseHistory {
  id: string;
  waktu: string;
  nama_paket: string;
  miles_didapat: number;
  total_bayar: number;
}

export interface Tier {
  id_tier: string;
  nama: string;
  minimal_frekuensi_terbang: number;
  minimal_tier_miles: number;
}

export interface TopMember {
  nama: string;
  total_miles: number;
  jumlah_transaksi: number;
  rank: number;
}

export interface DetailedTransaction {
  id: string;
  nama_member: string;
  miles: number;
  waktu: string;
  tipe: 'Transfer' | 'Redeem' | 'Package' | 'Klaim';
}