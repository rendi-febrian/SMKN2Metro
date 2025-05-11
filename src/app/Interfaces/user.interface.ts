export interface IUser {
  id: number;
  name: string;
  email: string;
  api_token: string;
  role: number;
  photo: string;
  token?: any;
  created_at: string;
  updated_at: string;
  deleted: number;
}