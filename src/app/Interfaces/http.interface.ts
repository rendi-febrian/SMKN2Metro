export interface IFetch<T = any> {
  status : number;
  msg    : string;
  data?  : T;
  errors?: T;
}

export interface IPagination<T = any> {
  current_page  : number;
  data          : T;
  first_page_url: string;
  from          : number;
  last_page     : number;
  last_page_url : string;
  next_page_url?: any;
  path          : string;
  per_page      : number;
  prev_page_url?: any;
  to            : number;
  total         : number;
}