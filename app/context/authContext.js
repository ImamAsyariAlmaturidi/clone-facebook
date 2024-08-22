import { createContext } from "react";
export const authContext = createContext({
  isLogin: false,
  setIsLogin: (value = false) => {},
});
