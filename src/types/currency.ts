export interface CurrencyItem {
    currency: string;
    date: string;
    delta: number;
    index: 'UP' | 'DOWN';
    logo: string | null;
    name: string;
    quant: string;
    sort: string;
    value: string;
  }
  