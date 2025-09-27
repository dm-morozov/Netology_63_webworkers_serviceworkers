// ./src/ts/UIComponent.ts

/**
 * Абстрактный базовый класс для всех UI-компонентов.
 * Инкапсулирует работу с корневым DOM-элементом
 * и базовые операции показа/скрытия.
 */

export abstract class UIComponent {
  protected element: HTMLElement;

  // Класс CSS, используемый для скрытия элементов
  private static readonly HIDDEN_CLASS = "hidden";

  /**
   * @param selector Селектор DOM-элемента, которым управляет компонент.
   */

  constructor(selector: string) {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      throw new Error(`[UIComponent Error]: Элемент ${selector} не найден!`);
    }

    this.element = element;
  }

  // Заставляет наследуемый класс реализовать метод render
  abstract render(): void;

  protected hide(el: HTMLElement = this.element): void {
    el.classList.add(UIComponent.HIDDEN_CLASS);
  }

  protected show(el: HTMLElement = this.element): void {
    el.classList.remove(UIComponent.HIDDEN_CLASS);
  }
}
