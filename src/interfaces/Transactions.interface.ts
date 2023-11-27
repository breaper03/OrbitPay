export interface BalanceList {
  accountAddress:   string;
  crypto:           boolean;
  currencyIconPath: string;
  currencyName:     string;
  currencySymbol:   string;
  exchangeRate:     number;
  moneyType:        string;
  total:            string;
  totalInUsd:       number;
  totalUsd:         number;
}
