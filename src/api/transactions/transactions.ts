
const criptovenApiUrl = "http://54.220.205.31/api"
const cookie = "PHPSESSID="
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

export const getTransactionFees = async (amount: number, currencyFrom: string, token: string) => {
  const formdata = {amount, feeTypeCode: "exchange", currencyFrom}
  return await fetch(`${criptovenApiUrl}/transactions/get-fees`, {
    method: "POST",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(formdata)
  }).then((data) => data.json())
    .then((data) => {
      // console.log(data)
      return data
    })
    .catch((error) => error)
}

export const sendMoney = async (currency: string, amount: number, toAddr: string, description: string, token: string) => {
  
  const formdata = {currency, amount: amount, toAddr, description}
  
  const formData = new FormData()
  formData.append("currency", "BTC");
  formData.append("amount", "0.0005");
  formData.append("toAddr", "33zoDrwBwZKNAhaifNpTTu9gXfz4VzdfUV");
  formData.append("description", "Send crypto through the new API");

  console.log("formdata", JSON.stringify(formdata))
  console.log("token", token)
  return await fetch(`${criptovenApiUrl}/transactions/cryptocurrencies/send`, {
    method: "POST",
    redirect: "follow",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(
      {currency: "BTC", amount: 0.00001, toAddr: "2N9FvoWY5MdVnXpTfMrQm6ii9fgNfaH6R1J", description: "Send crypto through the new API"}
    )
  }).then((data) => {
    console.log("dataJSON", data)
    return data.json()
  })
    .then((data) => {
      console.log("dataApi", data)
      return data
    })
    .catch((error) => {
      console.error("error", error)
      return error
    })
}

export const calculateMoney = async (currency: string, amountUSD: string, address: string, token: string) => {
  const getCryptoAmount = await getExchangeRates("USD", currency, token)
  // convertir el monto en usd a la criptomoneda seleccionadad por el usuario
  const amount = (+amountUSD / getCryptoAmount.response[`USD${currency}`].amountUnformatted).toFixed(8)
  const formdata = {currency, amount: amount, address}

  console.log("formdata", JSON.stringify(formdata))
  console.log("token", token)
  return await fetch(`${criptovenApiUrl}/transactions/cryptocurrencies/calculate`, {
    method: "POST",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(formdata)
  }).then((data) => {
    console.log("dataJSON", data)
    return data.json()
  })
    .then((data) => {
      console.log("dataApi", data)
      return data
    })
    .catch((error) => {
      console.log("error", error)
      return error
    })
}

export const swapMoney = async (currencyFrom: string, currencyTo: string, amount: number, token: string) => {
  const obj = {currencyFrom, currencyTo, amount, uuid: ""}
  const myHeaders = new Headers()
  myHeaders.append("Cookie", "PHPSESSID=")
  await fetch(`${criptovenApiUrl}/transactions/exchange-order/create`, {
    method: "POST",
    redirect: "follow",
    credentials: "include",
    headers: {...myHeaders, "Authorization": `Bearer ${token}`},
    body: JSON.stringify(obj)
  }).then(data => data.json())
    .then((data) => {
      console.log(data)
      return data
    })
    .catch((error) => {
      console.log(error)
      return error
    })
}


