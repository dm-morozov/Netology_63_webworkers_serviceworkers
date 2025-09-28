// ./src/ts/App.ts

import NewsFetcher from "./NewsFetcher";
import NewsFeedUI from "./NewsFeedUI";
import { ApiResponse } from "./type";

/**
 * Главный класс приложения.
 * Выполняет роль контроллера: связывает UI, логику данных и Service Worker.
 */

export default class App {
  private fetcher: NewsFetcher;
  private ui: NewsFeedUI;
  private refreshButton: HTMLButtonElement;

  private readonly serviceWorkerPath: string = "./sw.ts";

  constructor() {
    console.log("[App]: Инициализация приложения...");

    // 1. Инициализация компонентов
    this.fetcher = new NewsFetcher();
    this.ui = new NewsFeedUI("#news-list", "#error");
    const refreshButton = document.querySelector("#refresh");

    if (!(refreshButton instanceof HTMLButtonElement)) {
      throw new Error(
        `[App Error]: Кнопка обновления (#refresh) не найдена в DOM.`,
      );
    }

    this.refreshButton = refreshButton;

    // 2. Настройка обработчиков событий
    this.refreshButton.addEventListener("click", () => this.loadNews());

    // 3. Регистрация Service Worker
    this.registerServiceWorker();

    // 4. Начальная загрузка
    this.loadNews();
  }

  /**
   * Загружает новости, управляя состоянием UI.
   */
  private async loadNews(): Promise<void> {
    this.ui.showLoading();
    this.refreshButton.disabled = true;

    try {
      const apiResponse: ApiResponse = await this.fetcher.fetchNews();

      if (apiResponse.status === "ok" && apiResponse.data) {
        this.ui.displayNews(apiResponse.data);
      } else {
        const message = apiResponse.message || "Не удалось загрузить новости";
        this.ui.showError(message);
      }
    } catch (error) {
      this.ui.showError("Критическая ошибка приложения при загрузке данных.");
      console.error("[App Error]:", error);
    } finally {
      this.refreshButton.disabled = false;
    }
  }

  /**
   * Регистрирует Service Worker при полной загрузке страницы.
   */
  private registerServiceWorker(): void {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register(this.serviceWorkerPath, { scope: "/" })
          .then((registration) => {
            console.log(
              "[SW]: Service Worker зарегистрирован успешно. Scope:",
              registration.scope,
            );
          })
          .catch((error) => {
            console.error(
              "[SW]: Service Worker не удалось зарегистрировать:",
              error,
            );
          });
      });
    } else {
      console.warn("[SW]: Service Workers не поддерживаются в этом браузере.");
    }
  }
}
