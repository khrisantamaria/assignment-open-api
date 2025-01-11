export interface CurrencyResponse {
  data: {
    [key: string]: number;
  };
  query: {
    base_currency: string;
    timestamp: number;
  };
  status: string;
  message?: string;
}

export interface Currency {
  code: string;
  rate: number;
} 