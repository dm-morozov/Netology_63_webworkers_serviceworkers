// 🏋️ Практика RxJS

// 🔹 Уровень 1: Базовые потоки

// Задача 1. Таймер
// Сделай поток, который:
// каждую секунду выводит число (0,1,2,...);
// останавливается после 5 значений.
// 👉 Попробуй написать код.

import { interval, fromEvent, of, forkJoin, combineLatest } from "rxjs";
import {
  catchError,
  debounceTime,
  startWith,
  take,
  tap,
  map,
  distinctUntilChanged,
  switchMap,
} from "rxjs/operators";

export function timer() {
  interval(1000)
    .pipe(take(5))
    .subscribe((v) => console.log(v));
}

// Задача 2. Клики по кнопке

// Сделай поток, который:
// слушает клики по кнопке <button>Нажми</button>;
// при клике выводит "Кнопка нажата!".

export function clickBtn() {
  const btn = document.querySelector(".attention-btn") as HTMLButtonElement;
  const divEl = document.querySelector(".click-for-btn") as HTMLDivElement;

  if (!btn || !divEl) return;

  const click$ = fromEvent(btn, "click");
  click$.subscribe(() => {
    divEl.textContent = "Кнопка нажата!";
    console.log("Кнопка нажата.");
  });
}

// 🔹 Уровень 2: Операторы
// Задача 3. Ввод текста
// Сделай поток, который:
// отслеживает ввод текста в <input>;
// ждёт 500 мс после последнего ввода (debounceTime);
// выводит только уникальные значения (distinctUntilChanged).

export function trackInput() {
  const input = document.querySelector(".track-input") as HTMLInputElement;
  const divEl = document.querySelector(
    ".displays-tracked-date",
  ) as HTMLDivElement;

  if (!input) {
    console.warn("Элемент .track-input не найден");
    return;
  }

  const input$ = fromEvent<InputEvent>(input, "input").pipe(
    map((event) => (event.target as HTMLInputElement)?.value ?? ""),
    debounceTime(500),
    distinctUntilChanged(),
  );
  const subscription = input$.subscribe((value: string) => {
    if (divEl) {
      divEl.textContent = value;
    }
  });

  window.addEventListener("beforeunload", () => subscription.unsubscribe());
}

// Задача 4. API запрос

// Сделай поток, который:
// при клике на кнопку делает AJAX-запрос к
// https://jsonplaceholder.typicode.com/users/1;
// выводит имя пользователя (name) в консоль.

import { ajax } from "rxjs/ajax";

export function getUser() {
  const btn = document.querySelector(".ajax-request-btn");
  const divResponseName = document.querySelector(".ajax-response-name");

  if (!btn || !divResponseName) return;

  fromEvent(btn, "click")
    .pipe(
      tap(() => (divResponseName.textContent = "Загрузка...")),
      switchMap(() =>
        forkJoin([
          ajax.getJSON<{ name: string }>(
            "https://jsonplaceholder.typicode.com/users/1",
          ),
          ajax.getJSON<{ name: string }>(
            "https://jsonplaceholder.typicode.com/users/2",
          ),
        ]).pipe(
          catchError((_) =>
            of([{ name: "Ошибка запроса" }, { name: "Ошибка запроса" }]),
          ),
        ),
      ),
    )
    .subscribe(([user1, user2]) => {
      if (user1.name === "Ошибка запроса" || user2.name === "Ошибка запроса") {
        divResponseName.textContent = "Ошибка запроса";
      } else {
        divResponseName.textContent = `${user1.name} и ${user2.name}`;
      }
    });
}

// 🔹 Уровень 3: Комбинации потоков
// Задача 5. Два поля ввода

// Есть два <input>:
// в первом — имя;
// во втором — фамилия.
// Сделай поток, который при любом изменении выводит строку:
// Полное имя: {имя} {фамилия}

export function FioInput() {
  const inputFirstname = document.querySelector(
    ".firstname",
  ) as HTMLInputElement;
  const inputLastname = document.querySelector(".lastname") as HTMLInputElement;
  const divEl = document.querySelector(".last-first-name") as HTMLDivElement;

  if (!inputFirstname || !inputLastname || !divEl) {
    console.warn("Элементы DOM не найдены");
    return;
  }

  const firstName$ = fromEvent(inputFirstname, "input").pipe(
    map((event) => (event.target as HTMLInputElement).value),
    startWith(""), // чтобы combineLatest сработал сразу
  );

  const lastname$ = fromEvent(inputLastname, "input").pipe(
    map((event) => (event.target as HTMLInputElement).value),
    startWith(""),
  );

  combineLatest([firstName$, lastname$])
    .pipe(map(([first, last]) => `Полное имя: ${first} ${last}`))
    .subscribe((fullname) => {
      divEl.textContent = fullname;
    });
}
