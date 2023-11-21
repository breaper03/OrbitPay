import {CRIPTOVEN_API_URL} from "@env"
import { IUserLogin, IUserRegistration } from "../../interfaces/Users.interface"

export const login = async (credentials: IUserLogin) => 
  await fetch(`${CRIPTOVEN_API_URL}/login_check`, {
    method: "POST",
    body: JSON.stringify(credentials),
    redirect: "follow"
  })
  .then((response) => response.json())
  .then((data) => data)
  .catch((error) => {
    console.log("errorLoginOnAPI", error)
    throw new Error(error);
  })


export const register = async (credentials: any) => {
  const { email, passwordFirst, passwordSecond, userType, reside } = credentials;
  const formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password[first]", passwordFirst);
  formdata.append("password[second]", passwordSecond);
  formdata.append("userType", userType.toString());
  formdata.append("reside", reside.toString());

  return await fetch(`${CRIPTOVEN_API_URL}/users/register`, {
    method: "POST",
    body: formdata,
    redirect: "follow"
  })
  .then((response) => response.json())
  .then((data) => data)
  .catch((error) => {
    console.log("errorRegisterOnAPI", error)
  })
}

export const resetPassword = async (email: string) => {

  const formdata = new FormData()
  formdata.append("email", email.toString());
  formdata.append("callback_url", "https://app.criptoven.io/users/recover-password");

  return await fetch(`${CRIPTOVEN_API_URL}/users/forgot-password`, {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  })
} 

export const getOne = async (userId: string, token: string) => 
  await fetch(`${CRIPTOVEN_API_URL}/users/${userId}`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((response) => response.json())
  .then(data => {
    return data
  })
  .catch((error) => {
    console.log("error en fetch", error)
    throw new Error(error);
  })

