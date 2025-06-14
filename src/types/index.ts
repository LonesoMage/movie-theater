export * from './movie';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// API error від The Movie Database
export interface MovieDbError {
  success: boolean;
  status_code: number;
  status_message: string;
}