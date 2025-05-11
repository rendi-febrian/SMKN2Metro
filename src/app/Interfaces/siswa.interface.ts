export interface ISiswa {
  siswa_serial_id: number;
  siswa_uuid: string;
  siswa_name: string;
  siswa_password: string;
  siswa_nis: string;
  siswa_nisn: string;
  siswa_dob_place: string;
  siswa_dob: string;
  siswa_address: string;
  siswa_agama: number;
  siswa_gender: number;
  siswa_phone: string;
  siswa_kelas_id: number;
  siswa_jurusan_id: number;
  siswa_subjurusan_id: number;
  siswa_absence?: any;
  siswa_token: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted: number;
  siswa_kelas_name: string;
  siswa_sub_jurusan_name: string;
  siswa_jurusan_name: string;
  siswa_gender_name: string;
  siswa_agama_name: string;
}
