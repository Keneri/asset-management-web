type CryptoListDataType = {
  id: string;
  symbol: string;
  name: string;
};

type GetCryptoListResponseType = CryptoListDataType[];

export type { CryptoListDataType, GetCryptoListResponseType };
