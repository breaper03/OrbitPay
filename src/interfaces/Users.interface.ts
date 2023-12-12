export interface IUser {
  id: string
  identificationNumberType: string;
  identificationNumber: string;
  firstName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  birthdate: Date;
  codePhoneCountry: string;
  phoneNumber: string;
  email: string;
  address2: string;
  username: string;
  residenceCountry: INationality;
  nationality: INationality;
}

export interface IUserRegistration {
  email: string
  passwordFirst: string
  passwordSecond: string
  userType: number
  reside: number
}

export interface IUserLogin {
  username: string
  password: string
}

export interface IGender {
  nombre: string;
}

export interface IOccupation {
  name: string;
}

export interface IUserNoVerified {
  codePhoneCountry: string;
  email: string;
  username: string;
  verificationStatus: IVerificationStatus;
}

export interface IVerificationStatus {
  id: number;
  name: string;
}


export interface IUserSesion {
  token: string;
  data:  IData;
}

export interface IUserCryptoAccount {
  address: string;
  active: boolean;
  currency: ICurrency;
}

export interface IUser {
  total: string;
  totalUsd: number;
  currencySymbol: string;
  exchangeRate: number;
  totalInUsd: number;
}

export interface IUserAccounts {
  address:  string;
  active:   boolean;
  currency: ICurrency;
}

export interface INationality {
  code: string;
  name: string;
  nationality: string;
}

export interface ICurrency {
  name: string;
  symbol: string;
  type: string;
}

export interface IData {
  id:       number;
  username: string;
  roles:    string[];
}



