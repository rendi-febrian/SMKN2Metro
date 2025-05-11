export interface IExam {
  ujian_serial_id: number;
  ujian_uuid: string;
  ujian_name: string;
  ujian_mata_pelajaran_id : number;
  ujian_kelas_id : number;
  ujian_jurusan_id: number;
  ujian_duration : number;
  ujian_start_date: string;
  ujian_end_date : string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted: number;
  ujian_end_access: string;
  ujian_start_access: string;
  mata_pelajaran_name: string;
  ujian_kelas_name: string;
  ujian_jurusan_name: string;
  guru_name?: any;
  status: boolean;
  result?: any;
  total : number;
}

export interface IExamDetail extends IExam {
  ujian_mata_pelajaran_id_label: string;
  soal                         : ISoal[];
}

export interface ISoal {
  soal_uuid       : string;
  soal_description: string;
  soal_choices    : any[];
}