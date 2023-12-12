import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { IUser, IUserLogin, IUserNoVerified, IUserRegistration, IUserSesion } from "../interfaces/Users.interface";
import { getOne, login, register, resetPassword, getUserAccount } from "../api/users/Users";
import * as SecureStore from "expo-secure-store";
import { getBalance } from "../api/transactions/transactions";
import { BalanceList } from "../interfaces/Transactions.interface";

interface UserContextProps {
  user: IUser | IUserNoVerified;
  initialScreen: string;
  transactions: BalanceList[];
  setUser: (user: IUser | null) => void;
  handleLogin: (credentials: IUserLogin) => Promise<void>;
  handleRegister: (credentials: IUserRegistration) => Promise<void>;
  handleLogOut: () => void;
  handleUserBalance: () => Promise<void | { code: number; response: BalanceList[]; }>
  getUserAccounts: () => Promise<any>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>();

  const [initialScreen, setInitialScreen] = useState("Loading");

  const [transactions, setTransactions] = useState<BalanceList[] | undefined>()


  useEffect(() => {
    handleAutoLogin();
  }, [])
  
  const timeout = (ms: number, promise: Promise<any>) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject(new Error('Tiempo de espera agotado'));
      }, ms);

      promise.then(
        (result: any) => {
          clearTimeout(timeoutId);
          resolve(result);
        },
        (error: any) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      );
    });
  };

  const handleAutoLogin = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");

    if (token === null || userId === null) {
      setInitialScreen("Login");
    } else {
      try {
        const res: any = await timeout(20000, getOne(userId, token)); // Espera máximo 20 segundos
        if (res.code !== 200) {
          setInitialScreen("Login");
        } else {
          setUser(res.response);
          res.code === 200 ? setInitialScreen("Dashboard") : setInitialScreen("Login");
        }
      } catch (error) {
        setInitialScreen("Login");
      }
    }
  };

  const handleLogin = async (credentials: IUserLogin) => {
    const response = await login(credentials)
    if (!response.data) {
      throw new Error(`Combinacion de correo y contraseña incorrectos...`)
    } else {
      const getUser = await getOne(response.data.id, response.token)
        .then(async (data) => {
          await SecureStore.setItemAsync("token", response.token)
          await SecureStore.setItemAsync("userId", JSON.stringify(response.data.id))
          console.log(data.response)
          setUser(data.response)
          setTransactions([])
          return data
        })
      return getUser
    }
  }
  
  const handleRegister = async (credentials: IUserRegistration) => {
    try {
      const registerData = await register(credentials);
      return registerData;
    } catch (error) {
      throw new Error(`Error: ${error}`)
    }
  }

  const handleLogOut = async () => {
    setTransactions([])
    await SecureStore.deleteItemAsync("token")
    await SecureStore.deleteItemAsync("userId")
  }

  const handleResetPassword = async (email: string) => {
    return await resetPassword(email).then((data) => console.log(data))  
  }

  const handleUserBalance = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId")
    return await getBalance(userId, token)
      .then((data: {code: number, response: BalanceList[]}) => {
        setTransactions(data.response)
        return data
      })
      .catch((error) => {
        console.log("error on handleUserBalance", error)
        return error
      })
  }

  const getUserAccounts = async () => {
    const token = await SecureStore.getItemAsync("token")
    const userId = await SecureStore.getItemAsync("userId")
    return await getUserAccount(userId, token)
      .then((data) => {
        return data
      })
      .catch((error) => {
        console.log("error on getUserAccounts", error)
        return error
      })
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      initialScreen, 
      setUser, 
      handleLogin, 
      handleRegister, 
      handleLogOut,
      transactions,
      handleUserBalance,
      getUserAccounts
    }}>
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