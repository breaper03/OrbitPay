import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { IUser, IUserLogin, IUserNoVerified, IUserRegistration, IUserSesion } from "../interfaces/Users.interface";
import { getOne, login, register, resetPassword } from "../api/users/Users";
import * as SecureStore from "expo-secure-store";

interface UserContextProps {
  user: IUser | IUserNoVerified;
  initialScreen: string;
  setUser: (user: IUser | null) => void;
  handleLogin: (credentials: IUserLogin) => Promise<void>;
  handleRegister: (credentials: IUserRegistration) => Promise<void>;
  handleLogOut: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUserNoVerified | IUser | undefined>();

  const [initialScreen, setInitialScreen] = useState("Loading")

  useEffect(() => {
    handleAutoLogin()
  }, [])
  
  const handleAutoLogin = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");

    console.log("token", token.length)
    console.log("userId", userId.length)

    if (token.length === 0 || userId.length === 0) {
      setInitialScreen("Login")
    } else {
      return await getOne(userId, token)
        .then((res) => {
          res.code && res.code === 401
            ? console.log("se vencio el token", res.code)
            : setUser(res.response)
          return res
        }).then((data) => data.code === 200 ? setInitialScreen("Dashboard") : setInitialScreen("Login"))
    }
  }

  const handleLogin = async (credentials: IUserLogin) => {
    try {
      const response = await login(credentials);
      await getOne(response.data.id, response.token).then((data) => setUser(data.response))
      await SecureStore.setItemAsync("token", response.token)
      await SecureStore.setItemAsync("userId", JSON.stringify(response.data.id))
      return response.data;
    } catch (error) {
      throw new Error("Credenciales incorrectas!")
    }
  }
  
  const handleRegister = async (credentials: IUserRegistration) => {
    try {
      const registerData = await register(credentials);
      return registerData;
    } catch (error) {
      throw new Error("Credenciales incorrectas!")
    }
  }

  const handleLogOut = async () => {
    setUser(undefined)
    await SecureStore.setItemAsync("token", "")
    await SecureStore.setItemAsync("userId", "")
  }

  const handleResetPassword = async (email: string) => {
    return await resetPassword(email).then((data) => console.log(data))  
  }

  return (
    <UserContext.Provider value={{ user, initialScreen, setUser, handleLogin, handleRegister, handleLogOut }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): UserContextProps => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export { UserProvider, useUser };