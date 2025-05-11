export * from './http.interface';
export * from './siswa.interface';
export * from './user.interface';
export * from './elearning.interface';
export * from './exam.interface';

export enum EStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  VALIDATION_ERROR = 202,
  SERVER_ERROR = 500,
  UNAUTHENTICATED = 401,
  NOT_FOUND = 404,
  NO_INTERNET = 0,
}

export const ModuleName = {
  ANNOUNCEMENT: 'pengumuman',
  E_LEARNING: 'elearning',
  EXAM: 'ujian',
  TEACHER: 'guru',
  JADWAL: 'jadwal',
  BLOG: 'blog',
  REPORT: 'raport',
} as const;
