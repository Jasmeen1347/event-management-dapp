import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const accountStore = (set) => ({
    account: null,
    conncectWallet: (allData) => {
        set((state) => ({
            account: allData
        }))
      }
})

const useAccountStore = create(
   
        persist(accountStore, {
            name: "account"
        })
)

export default useAccountStore;