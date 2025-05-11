export interface IElearning {
  created_at            : string;
  created_by            : number;
  created_by_name?      : any;
  deleted               : number;
  elearning_file        : string;
  elearning_jurusan_id  : number;
  elearning_jurusan_name: string;
  elearning_kelas_id    : number;
  elearning_kelas_name  : string;
  elearning_name        : string;
  elearning_serial_id   : number;
  elearning_uuid        : string;
  updated_at            : string;
}