console.log("it works!");

/**
 * Определяем обобщенный тип для подписчиков (наблюдателей).
 * T — тип значения, которое передается наблюдателям.
 */
export default class Subject<T> {
  // Наблюдатели — это массив функций, которые принимают T и ничего не возвращают (void).
  private observers: ((value: T) => void)[] = [];

  constructor() {
    this.observers = [];
  }

  /**
   * Добавляет нового наблюдателя.
   * @param observer Функция, которая будет вызвана при next(value).
   */
  subscribe(observer: (value: T) => void) {
    this.observers.push(observer);
  }

  /**
   * Передает новое значение всем подписчикам.
   * @param value Новое значение, которое получат наблюдатели.
   */
  next(value: T) {
    this.observers.forEach((observer) => observer(value));
  }
}
