const criptovenApiUrl = "http://54.220.205.31/api"

export interface IBanks {
  id:         number;
  code:       string;
  name:       string;
  currencies: IBankCurrency[];
}

export interface IBankCurrency {
  symbol: string;
  type:   string;
  sign:   string;
}


export interface IBankAccounts {
  alias: string,
  currency: string,
  bankCodeNumber: number,
  bankCodePhoneCountry: number,
  phoneNumber: number,
  bancAccountType: number,
  bank: number
}

export const getBankAccounts = async (userId: string, token: string) => {
  return await fetch(`${criptovenApiUrl}/users/${userId}/bank-accounts`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then((data) => data.json())
    .then((data) => {
      console.log("data", data)
      return data
    })
    .catch((error) => {
      console.log("error", error)
      return error
    })
}

export const getBanks = async (token: string) => {
  return await fetch(`${criptovenApiUrl}/common/banks/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then((data) => data.json())
    .then((data: IBanks[]) => {
      return data
    })
    .catch((error) => {
      console.log("error", error)
      return error
    })
}

export const createBankAccount =  async (userId: string, form: any, token: string) => {
  const formdata = new FormData();

  Object.keys(form).forEach((element) => {
    formdata.append(element, form[element])
  });

  // var formdata = new FormData();
  // formdata.append("alias", "My Bank Account National in API");
  // formdata.append("currency", "VES");
  // formdata.append("bankCodeNumber", "123456");
  // formdata.append("bancCodePhoneCountry", "58");
  // formdata.append("phoneNumber", "4143110914");
  // formdata.append("bancAccountType", "2");
  // formdata.append("bank", "2");

  console.log("formdata", formdata);

  return await fetch(`${criptovenApiUrl}/users/${userId}/add/bank-accounts`, {
    method: "POST",
    redirect: "follow",
    body: formdata,
    headers: {
      'Content-Type': 'multipart/form-data',
      // 'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    console.log(data)
    return data
  })
  .catch((error) => {
    console.log("Catch", error)
    return error
  })
}

export const deleteBankAccount =  async (bankAccountId: string, token: string) => {
  console.log("bankAccountId", bankAccountId)

  return await fetch(`${criptovenApiUrl}/users/${bankAccountId}/delete/bank-accounts`, {
    method: "DELETE",
    redirect: "follow",
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    console.log(data)
    return data
  })
  .catch((error) => {
    console.log(error)
    return error
  })
}