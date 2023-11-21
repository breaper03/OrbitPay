import {CRIPTOVEN_API_URL} from "@env"
import { useUser } from "../../context/UserContext"


export const getCountries = async (token: string) => {
  await fetch(`${CRIPTOVEN_API_URL}/common/nationalities/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((response) => response.json())
  .then((data) => data)
}