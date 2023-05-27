import { createContext } from 'react'

export const AppSidebarContext = createContext({
  sidebarKey: '',
  setSidebarKey: key => console.log(key)
})

export const useAppSidebar = () => useContext(AppSidebarContext)
