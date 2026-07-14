import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminProfile {
  name: string;
  email: string;
  avatar: string;
  setProfile: (name: string, email: string, avatar: string) => void;
}

export const useAdminStore = create<AdminProfile>()(
  persist(
    (set) => ({
      name: "Juan Pérez",
      email: "juan.perez@inmobiliariatoto.com",
      avatar: "",
      setProfile: (name, email, avatar) => set({ name, email, avatar }),
    }),
    {
      name: 'admin-profile-storage',
    }
  )
);
