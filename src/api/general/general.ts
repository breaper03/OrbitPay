const criptovenApiUrl = "http://54.220.205.31/api"

export const getParroquia = async (token: string, municipalyId: number) => {
  return await fetch(`${criptovenApiUrl}/common/parroquias/list/${municipalyId}`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}

export const getMunicipio = async (token: string, stateId: number) => {
  return await fetch(`${criptovenApiUrl}/common/municipios/list/${stateId}`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}

export const getState = async (token: string) => {
  return await fetch(`${criptovenApiUrl}/common/estados/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}

export const getIncomeLevel = async (token: string) => {
  return await fetch(`${criptovenApiUrl}/common/income-levels/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}

export const getActividadEconomica = async (token: string) => {
  return await fetch(`${criptovenApiUrl}/common/economic-activities/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}

export const getFundsSources = async (token: string) => {
  return await fetch(`${criptovenApiUrl}/common/funds-source/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}

export const getCountries = async (token: string) => {
  return await fetch(`${criptovenApiUrl}/common/nationalities/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}

export const getOcupations = async (token: string) => {
  return await fetch(`${criptovenApiUrl}/common/ocupations/list`, {
    method: "GET",
    redirect: "follow",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((data) => data.json())
  .then((data) => {
    return data.response
  })
  .catch((error) => error)
}