import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Pages/Auth/Login'
import { useAppState } from '../state/AppState'
import { MenuSelectedKeysContext } from '../state/MenuSelectedKeys'
import { Routes } from './Routes'

const MainLayout = () => {
  const [selectedKeys, setSelectedKeys] = useState([])
  const { appState } = useAppState()
  if (!appState.isLoggedIn) return <Login />

  return (
    <MenuSelectedKeysContext.Provider
      value={{
        selectedKeys,
        setSelectedKeys
      }}
    >
      <BrowserRouter>
        <Routes role={appState.role} />
      </BrowserRouter>
    </MenuSelectedKeysContext.Provider>
  )
}

export default MainLayout
