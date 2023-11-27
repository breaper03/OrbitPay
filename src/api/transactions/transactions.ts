
const criptovenApiUrl = "http://54.220.205.31/api"
export const getBalance = async (userId: string, token: string) => 
  await fetch(`${criptovenApiUrl}/users/${userId}/balance`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then((data) => data.json())
    .then(data => {
      return data
    })
    .catch(error => console.log(error))


export const getTransactionsList = async (pagination: number, token: string) => 
  await fetch(`${criptovenApiUrl}/transactions/${pagination > 0 ? pagination : 0}`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
    .then(data => {
      return data
    })
    .catch(error => console.log(error))

export const getExchangeRates = async (first: string, second: string, token: string) => 
  await fetch(`${criptovenApiUrl}/transactions/exchange-rates/create/${first}/${second}`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
    .then(data => {
      return data
    })
    .catch(error => console.log(error))

