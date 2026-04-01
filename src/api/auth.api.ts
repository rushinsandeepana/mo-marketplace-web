import client from './client';

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

export const authApi = {
  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const res = await client.post('/auth/register', { name, email, password });
    return res.data;
  },

  login: async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const res = await client.post('/auth/login', { email, password });
    return res.data;
  },
};