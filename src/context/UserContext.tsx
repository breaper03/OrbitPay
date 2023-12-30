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
  handleGetOneUser: (userId: string, token: string) => Promise<void | any>
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

  const handleGetOneUser = async (userId: string, token: string) => {
    alert("entra al get one")
    alert(`userId: ${userId} pasa antes del get one`)
    await getOne(userId, token).then((data) => {
      console.log("data.response", data)
      setUser(data.response)
      return data
    })
  }


  const handleLogin = async (credentials: IUserLogin) => 
    await login(credentials).then(async (res) => {
      if (res.code && res.code === 401) {
        return res
      } else {
        res.token && await SecureStore.setItemAsync("token", res.token)
        res.data.id && await SecureStore.setItemAsync("userId", res.data.id.toString())
        alert(`antes de llamar a get one`)
        alert(`userId: ${res.data.id}, token: ${res.token}`)
        return res
      }
    })
    .catch(error => {
      alert(error)
      return error
    })
  
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
    const userId = await SecureStore.getItemAsync("userId");
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
      getUserAccounts,
      handleGetOneUser
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