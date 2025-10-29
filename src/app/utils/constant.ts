import { Dispatch, SetStateAction } from "react";

export interface ApiResponse<T> {
  children: never[];
  admission: any;
  id: boolean;
  data?: T | PaginatedResponse<T>;
  message?: string;
  success: boolean;
  token?: string;
  status?: number;
  total?: number;
  type?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
}

// export interface PaginatedResponse<T> {
//   count?: number;
//   next?: string | null;
//   previous?: string | null;
//   data: T[];
// }
export type SetStateAnyOrNull = Dispatch<SetStateAction<any | null>>;
export type SetStateNullable<T> = Dispatch<SetStateAction<T | null>>;
