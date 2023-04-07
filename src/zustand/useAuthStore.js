import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  currentUser: null,
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      setCurrentUser: (token) => set((_) => ({ currentUser: token })),
      resetCurrentUser: () => set(initialState),
    }),
    {
      name: 'current-user', // unique name
    }
  )
);

export default useAuthStore;
