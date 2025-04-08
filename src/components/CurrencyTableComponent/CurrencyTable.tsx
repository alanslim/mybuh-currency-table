import React, { useState } from "react";
import { getCurriencies } from "../../api/getCurriencies";
import { Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export const CurrencyTable: React.FC = () => {
  //для сортировки конкретных столбцов (название валюты, курс, изменение за месяц)
  const [sortField, setSortField] = useState<"value" | "delta" | "name">(
    "value"
  );

  //юзаем useState для переключения сортировки
  const [sort, setSort] = useState(true);

  //запрашиваем данные через react query, обращаясь к нашей апишной функции getCurriencies
  const { isLoading, data, error } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurriencies,
  });

  //если отдаст ерор - возвращаем ошибку в консоль и выводим сообщение об ошибке загрузки

  if (error) {
    console.error(error);
    return <p className="text-center mt-10 text-red-600">Ошибка загрузки</p>;
  }

  //сортируем либо по восходящей, либо по нисходящей. Если это изменение или курс то приводим к строке

  const sortedData = data
    ? [...data].sort((a, b) => {
        let aField: string | number;
        let bField: string | number;

        if (sortField === "name") {
          aField = a.name;
          bField = b.name;
        } else {
          aField = parseFloat(a[sortField as "value" | "delta"].toString());
          bField = parseFloat(b[sortField as "value" | "delta"].toString());
        }

        if (aField < bField) return sort ? -1 : 1;
        if (aField > bField) return sort ? 1 : -1;
        return 0;
      })
    : [];

  //хэндлер для обработки сортировки
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSort(!sort);
    } else {
      setSortField(field);
      setSort(true);
    }
  };
  //для получения символа в зависимости от того, по восходящей или по нисходящей ли сортировка
  const getSortSymbol = (field: typeof sortField) =>
    sortField === field ? (sort ? "↑" : "↓") : "";

  //форматируем дату в понятный формат
  const formattedDate =
    data && data.length > 0
      ? new Date(data[0].date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <p className="text-lg text-gray-600 mb-2 text-center">
        Всегда актуальные курсы валют в Казахстане, Официальный курс
        Национального Банка Казахстана.
      </p>
      <p className="text-sm text-gray-600 mb-2 text-center">
        Курсы актуальны на:{" "}
        <span className="font-semibold inline-block">
          {formattedDate ? (
            formattedDate
          ) : (
            <Skeleton variant="text" width={98} height={19} />
          )}
        </span>
      </p>

      <table className="w-full border border-gray-300 p-10 shadow-xl/30 rounded-md">
        <thead className="sticky top-0">
          <tr className="  bg-white">
            <th
              className="p-2 text-left cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("name")}
            >
              Валюта {getSortSymbol("name")}
            </th>
            <th
              className="p-2 text-left cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("value")}
            >
              Курс {getSortSymbol("value")}
            </th>
            <th
              className="p-2 text-left cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("delta")}
            >
              Изменение за месяц {getSortSymbol("delta")}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* если наше query отдало isLoading - показываем скелетоны*/}
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-gray-300  even:bg-gray-50 bg-white hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-2">
                    <Skeleton variant="text" width={120} height={24} />
                  </td>
                  <td className="p-2">
                    <Skeleton variant="text" width={80} height={24} />
                  </td>
                  <td className="p-2">
                    <Skeleton variant="text" width={60} height={24} />
                  </td>
                </tr>
              ))
            : // в противном случае отрисовываем сортированные с апи (или в нашем случае с замоканных данных) строки с колонками
              sortedData.map((item) => (
                <tr
                  key={item.currency}
                  className="border-gray-300 even:bg-gray-50 bg-white border-t hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-2">
                    <div className="flex flex-col">
                      <span className="font-medium font-ms">{item.name}</span>
                      <span className="text-sm text-gray-500 font-bold">
                        {item.quant} {item.currency}
                      </span>
                    </div>
                  </td>
                  <td className="p-2">{item.value}</td>
                  <td
                    className={`p-2 ${
                      item.index === "UP" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {/* для стрелочек, указывающих направление курса используем svg иконки, взятые с Heroicons */}
                    <div className="flex items-center">
                      {item.index === "UP" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}{" "}
                      {item.delta}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
