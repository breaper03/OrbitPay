import {CRIPTOVEN_API_URL} from "@env"
import { IUserRegistration } from "../../interfaces/Users.interface"

export const UserRegister = async (data: IUserRegistration) => 
  fetch(`${CRIPTOVEN_API_URL}/users/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    redirect: 'follow'
  })
  .then((response) => response.json())
  .then((data) => {
    // Manejar la respuesta del servidor
    console.log(data);
  })
  .catch((error) => {
    // Manejar errores de la solicitud
    console.error('Error en la solicitud:', error);
  });