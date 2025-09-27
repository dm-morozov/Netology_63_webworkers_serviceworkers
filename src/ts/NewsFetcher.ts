// ./src/ts/NewsFetcher.ts

import { ApiResponse } from "./type";

/**
 * Класс для работы с реальным API новостей.
 * Инкапсулирует логику получения данных по сети.
 */
export default class NewsFetcher {
  private apiUrl: string = "http://localhost:3030/news";

  constructor(apiURL?: string) {
    if (apiURL) this.apiUrl = apiURL;
  }

  public async fetchNews(): Promise<ApiResponse> {
    console.log(`[NewsFetcher]: Запрос новостей к API: ${this.apiUrl}...`);

    try {
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        throw new Error(
          `Ошибка HTTP: ${response.status} ${response.statusText}`,
        );
      }

      const apiResponse: ApiResponse = await response.json();

      // Теперь можем проверить статус error или ok
      if (apiResponse.status === "error") {
        throw new Error(
          apiResponse.message || "Ошибка сервера при обработке данных.",
        );
      }

      // Если статус ok, то возвращаем ответ
      return apiResponse;
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log(`[NewsFetcher Error]: ${errorMessage}`);

      return {
        status: "error",
        message: `Не удалось получить новости: ${errorMessage}`,
      };
    }
  }
}
