export interface IJadwal {
  created_at            : string;
  created_by            : number;
  created_by_name?      : any;
  deleted               : number;
  jadwal_file        : string;
  jadwal_jurusan_id  : number;
  jadwal_jurusan_name: string;
  jadwal_kelas_id    : number;
  jadwal_kelas_name  : string;
  jadwal_name        : string;
  jadwal_serial_id   : number;
  jadwal_uuid        : string;
  updated_at            : string;
}
