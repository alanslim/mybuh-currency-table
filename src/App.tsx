import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrencyTable } from "./components/CurrencyTableComponent/CurrencyTable";
import "./index.css";

export function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-lime-200 text-gray-900 ">
        <h1 className="text-2xl font-ms text-center mt-6">Курсы валют Национального банка Республики Казахстан:</h1>
        <CurrencyTable />
      </div>
    </QueryClientProvider>
  );
}
