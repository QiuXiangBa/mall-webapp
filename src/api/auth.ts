import { http } from './http';
import type { AuthUser, LoginResp } from './types';

export const login = async (mobile: string, password: string): Promise<LoginResp> => {
  return http.post('/rider/auth/login', {
    mobile,
    password
  });
};

export const logout = async (): Promise<void> => {
  await http.post('/rider/auth/logout');
};

export const fetchMe = async (): Promise<AuthUser> => {
  return http.get('/rider/auth/me');
};
