
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

export const sendMoney = async (currency: string, amount: any, toAddr: string, description: string, token: string) => {
  
  const formdata = {currency, amount: amount, toAddr, description}
  
  const formData = new FormData()
  formData.append("currency", currency);
  formData.append("amount", amount);
  formData.append("toAddr", toAddr);
  formData.append("description", description);

  console.log("formdata", JSON.stringify(formdata))
  console.log("token", token)
  return await fetch(`${criptovenApiUrl}/transactions/cryptocurrencies/send`, {
    method: "POST",
    redirect: "follow",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
    body: formData
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

export const swapMoney = async (currencyFrom: string, currencyTo: string, amount: any, token: string) => {
  const formdata = new FormData()
  formdata.append("currencyFrom", currencyFrom);
  formdata.append("currencyTo", currencyTo);
  formdata.append("amount", amount);
  formdata.append("uuid", "");
  const myHeaders = new Headers()
  myHeaders.append("Cookie", "PHPSESSID=")
  await fetch(`${criptovenApiUrl}/transactions/exchange-order/create`, {
    method: "POST",
    redirect: "follow",
    credentials: "include",
    headers: {...myHeaders, "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data',},
    body: formdata
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

export const depositFiat = async (form: any, token: string) => {
  const formdata = new FormData()
  Object.keys(form).forEach((element) => formdata.append(`${element}`, form[element]))

  console.log("formdata", formdata)

  return await fetch(`${criptovenApiUrl}/transactions/fiats/deposit`, {
    method: "POST",
    redirect: "follow",
    headers: {
      "Authorization": `Bearer ${token}`, 
      'Content-Type': 'multipart/form-data'
      // 'Content-Type': 'application/json',
      // 'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
    },
    // body: JSON.stringify(form)
    body: formdata
  }).then((data) => data.json())
    .then(data => {
      console.log("dataen fetch", data)
      return data
    })
    .catch(error => {
      console.log("error en fetch", error)
      return error
    })
}


