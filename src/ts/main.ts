// ./src/ts/main.ts

import App from "./App";

// Ждем полной загрузки DOM перед инициализацией приложения
document.addEventListener("DOMContentLoaded", () => {
  try {
    new App();
    console.log("[Main]: Приложение успешно запущено.");
  } catch (error) {
    console.error(
      "[Main Error]: Фатальная ошибка при запуске приложения:",
      error,
    );
  }
});
