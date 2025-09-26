// ./src/ts/type.ts

/**
 * Интерфейс, описывающий одну новость.
 */
export interface NewsItem {
  id: string; // Уникальный идентификатор (Критичен для Service Worker и списков)
  title: string; // Заголовок (для UI)
  description: string; // Текст новости (для UI)
  image: string; // URL изображения (для UI)
  date: number; // Дата/время в формате UNIX timestamp (для отображения и сортировки)
}

/**
 * Тип для списка новостей.
 */
export type NewsList = NewsItem[];

/**
 * Интерфейс, описывающий структуру ответа от API.
 */
export interface ApiResponse {
  status: "ok" | "error";
  data?: NewsList;
  message?: string;
}
