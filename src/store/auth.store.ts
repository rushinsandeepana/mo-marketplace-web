interface User {
  id: string;
  email: string;
}

const AUTH_KEY = 'mo_auth';

export const authStore = {
  getToken(): string | null {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      if (!data) return null;
      return JSON.parse(data).token ?? null;
    } catch {
      return null;
    }
  },

  getUser(): User | null {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      if (!data) return null;
      return JSON.parse(data).user ?? null;
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: User): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
  },

  clearAuth(): void {
    localStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};