import { create } from 'zustand'

interface IModalState {
  isOpen: boolean
}

interface IModalActions {
  openModal: () => void
  closeModal: () => void
}

interface IUseModalStore {
  state: IModalState
  actions: IModalActions
}

export const useModalStore = create<IUseModalStore>((set) => ({
  state: {
    isOpen: false
  },
  actions: {
    openModal: () => {
      set({ state: { isOpen: true } })
    },
    closeModal: () => {
      set({ state: { isOpen: false } })
    }
  }
}))