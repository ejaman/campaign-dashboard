import { create } from 'zustand'

interface CampaignRegisterModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useCampaignRegisterModal = create<CampaignRegisterModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
