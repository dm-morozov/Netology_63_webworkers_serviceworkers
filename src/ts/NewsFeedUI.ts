// ./src/ts/NewsFeedUI.ts

import { NewsList, NewsItem } from "./type";
import { UIComponent } from "./UIComponent";

/**
 * Класс, управляющий отображением новостной ленты.
 * Отвечает за переключение состояний: Загрузка (Shimmer), Контент, Ошибка.
 */

export default class NewsFeedUI extends UIComponent {
  // #news-list - наш корневой элемент
  // (унаследован как this.element)
  private errorElement: HTMLElement;
  private placeholderMarkup: string;
  private newsListElement: HTMLElement;

  /**
   * @param newsListSelector Селектор для контейнера новостей (#news-list).
   * @param errorSelector Селектор для контейнера ошибки (#error).
   */
  constructor(newsListSelector: string, errorSelector: string) {
    super(newsListSelector);
    this.newsListElement = this.element;

    const errorEl = document.querySelector<HTMLElement>(errorSelector);
    if (!errorEl) {
      throw new Error(
        `[NewsFeedUI Error]: Элемент ${errorSelector} не найден!`,
      );
    }

    this.errorElement = errorEl;

    // Кэшируем разметку плейсхолдера из HTML
    this.placeholderMarkup = this.newsListElement.innerHTML;

    this.hide(this.errorElement);
  }

  /**
   * Реализация абстрактного метода render.
   * Используется для начального показа загрузки.
   */

  render(): void {
    this.showLoading();
  }

  /**
   * Показывает экран загрузки с плейсхолдерами и анимацией мерцания.
   */
  public showLoading(): void {
    this.hide(this.errorElement);
    this.show(this.newsListElement);
    this.newsListElement.innerHTML = this.placeholderMarkup;
    console.log(`[NewsFeedUI]: Покажем загрузку...`);
  }

  /**
   * Отображает полученные новости, заменяя плейсхолдеры.
   */
  public displayNews(news: NewsList) {
    this.hide(this.errorElement);
    this.show(this.newsListElement);
    this.newsListElement.innerHTML = news
      .map((item) => this.createNewsItemMarkup(item)) // превращаем каждую новость в HTML
      .join(""); // склеиваем в строку
    console.log(`[NewsFeedUI]: Отображено ${news.length} новостных элементов.`);
  }

  /**
   * Показывает сообщение об ошибке.
   */
  public showError(message: string): void {
    this.hide(this.newsListElement);
    this.show(this.errorElement);
    this.errorElement.innerHTML = `<p>${message}</p>`;
    console.error("[NewsFeedUI]: Показано сообщение об ошибке.");
  }

  private createNewsItemMarkup(item: NewsItem): string {
    const dateObj = new Date(item.date);
    const displayDate = dateObj.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const machineDate = dateObj.toISOString();

    return `
      <div class="news-item" data-id="${item.id}">
          <div class="news-item__title">${item.title}</div>
          <div class="news-item__content">
              <div class="news-item__image" style="background-image: url('${item.image}')"></div>
              <div class="news-item__text">
                  <p class="news-item__paragraph">${item.description.substring(0, 120)}...</p>
                  <time class="news-item__date" datetime="${machineDate}">${displayDate}</time>
              </div>
          </div>
      </div>
    `;
  }
}
