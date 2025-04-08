import {mockData} from "../mocks/mockData";
import { CurrencyItem } from "../types/currency";



//к сожалению пришлось замокать данные из-за запретов со стороны CORS, вот так бы выглядело если бы обращались непосредственно к апишке:

// export const getCurriencies = async (): Promise<CurrencyItem[]> => {
//   const res = await fetch(
//     "https://mybuh.kz/valuta/get_currencies_data.php?currency_month=&date=02.04.2025"
//   );
//   const data = await res.json();
//   const dateKey = Object.keys(data)[0];
//   return Object.values(data[dateKey]);
// };

export const getCurriencies = async (): Promise<CurrencyItem[]> => {
  return new Promise(res => {
    setTimeout(() => {
      res(mockData);
    }, 1000);
  })
};
