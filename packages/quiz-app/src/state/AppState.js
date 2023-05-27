import { createContext, useContext } from 'react'

export const defaultAppState = {
  isLoggedIn: false,
  userId: '',
  role: '',
  email: '',
  fullname: '',
  profileImg: '',
  accessToken: '',
  refreshToken: '',
  issuedAt: 0,
  expiresAt: 0,
  isAdmin: false
}

export const AppStateContext = createContext({
  appState: { ...defaultAppState },
  setAppState: obj => console.log(obj)
})

export const useAppState = () => useContext(AppStateContext)
