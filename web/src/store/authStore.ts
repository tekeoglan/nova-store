import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Staff {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
}

interface AuthSession<T> {
  user: T | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: T, token: string) => void;
  logout: () => void;
}

function createAuthSession<T>(): AuthSession<T> {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: (user, token) => {},
    logout: () => {},
  };
}

interface AuthState {
  userAuth: AuthSession<User>;
  staffAuth: AuthSession<Staff>;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userAuth: {
        ...createAuthSession<User>(),
        setAuth: (user, token) => set((state) => ({
          userAuth: { ...state.userAuth, user, token, isAuthenticated: true }
        })),
        logout: () => set((state) => ({
          userAuth: { ...state.userAuth, user: null, token: null, isAuthenticated: false }
        })),
      },
      staffAuth: {
        ...createAuthSession<Staff>(),
        setAuth: (staff, token) => set((state) => ({
          staffAuth: { ...state.staffAuth, user: staff, token, isAuthenticated: true }
        })),
        logout: () => set((state) => ({
          staffAuth: { ...state.staffAuth, user: null, token: null, isAuthenticated: false }
        })),
      },
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userAuth: {
          user: state.userAuth.user,
          token: state.userAuth.token,
          isAuthenticated: state.userAuth.isAuthenticated
        },
        staffAuth: {
          user: state.staffAuth.user,
          token: state.staffAuth.token,
          isAuthenticated: state.staffAuth.isAuthenticated
        },
      }),
      merge: (persistedState, currentState) => {
        const p = persistedState as { userAuth?: Partial<AuthSession<User>>; staffAuth?: Partial<AuthSession<Staff>> };
        return {
          ...currentState,
          ...persistedState,
          userAuth: { ...currentState.userAuth, ...p.userAuth },
          staffAuth: { ...currentState.staffAuth, ...p.staffAuth },
        };
      },
    }
  )
);

export type { User, Staff, AuthSession };