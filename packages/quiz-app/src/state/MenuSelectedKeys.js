import { createContext, useContext } from 'react'

export const MenuSelectedKeysContext = createContext({
  selectedKeys: [],
  setSelectedKeys: keys => console.log(keys)
})

export const useMenuSelectedKeys = () => useContext(MenuSelectedKeysContext)
