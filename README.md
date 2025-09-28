# Домашнее задание по занятию "WebWorkers, ServiceWorkers"

### Статус проекта
![CI](https://github.com/dm-morozov/Netology_63_webworkers_serviceworkers/actions/workflows/web.yaml/badge.svg)
![Netology](https://img.shields.io/badge/TypeScript-WebPack-blue)

### Описание проекта

Этот проект представляет собой реализацию домашнего задания к занятию "12. WebWorkers, ServiceWorkers" от Нетологии. Основная цель — разработать веб-приложение, которое использует Service Workers для кэширования статических ресурсов и обеспечения работы в офлайн-режиме, а также демонстрирует интерфейс загрузки с имитацией задержки. Проект построен с использованием TypeScript, Webpack для сборки фронтенда и Koa для серверной части, развернутой на Render.

#### Функциональность:
- **Интерфейс загрузки:** Отображает анимацию загрузки до получения данных с сервера или при отсутствии интернета.
- **Офлайн-режим:** Статические ресурсы (HTML, CSS, JS) кэшируются с помощью Service Worker, позволяя просматривать страницу без подключения.
- **Серверная часть:** Имитирует API с новостями с задержкой в 2 секунды для отражения реального сетевого трафика.
- **Сборка и деплой:** Фронтенд собирается через Webpack и деплоится на GitHub Pages, а серверная часть размещена на Render.

#### Технологии:
- **Frontend:** TypeScript, Webpack, HTML, CSS, Service Worker.
- **Backend:** Koa (Node.js), TypeScript.
- **Инструменты:** GitHub Actions, Render.

---

## Инструкции

### Установка и запуск локально

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/dm-morozov/Netology_63_webworkers_serviceworkers.git
   cd Netology_63_webworkers_serviceworkers
   ```

2. **Установите зависимости:**
   - Для фронтенда (в корневой папке):
     ```bash
     yarn install
     ```
   - Для бэкенда (в папке `Backend`):
     ```bash
     cd Backend
     yarn install
     ```

3. **Запустите сервер:**
   - Перейдите в папку `Backend`:
     ```bash
     cd Backend
     yarn build
     yarn start
     ```
   - Сервер запустится на `http://localhost:3030`.

4. **Соберите и запустите фронтенд:**
   - Вернитесь в корневую папку и выполните:
     ```bash
     yarn dev
     ```
   - Приложение будет доступно на `http://localhost:3000`.

5. **Тестирование офлайн-режима:**
   - Откройте DevTools в браузере (F12).
   - Перейдите во вкладку "Network" и включите "Offline".
   - Обновите страницу — должна отобразиться кэшированная версия с интерфейсом загрузки.

### Деплой

- **GitHub Pages:** Фронтенд автоматически деплоится на GitHub Pages через GitHub Actions. Ссылка на деплой: [https://dm-morozov.github.io/Netology_63_webworkers_serviceworkers/](https://dm-morozov.github.io/Netology_63_webworkers_serviceworkers/).
- **Render:** Серверная часть развернута на Render. Ссылка на API: [https://netology-63-webworkers-serviceworkers.onrender.com](https://netology-63-webworkers-serviceworkers.onrender.com). Настройки деплоя:
  - **Root Directory:** `Backend`
  - **Build Command:** `yarn --frozen-lockfile install && yarn build`
  - **Start Command:** `node dist/server.js`

### Структура проекта

```
Netology_63_webworkers_serviceworkers/
├── src/
│   ├── ts/
│   │   ├── App.ts              # Главный класс приложения
│   │   ├── NewsFetcher.ts      # Логика получения новостей с API
│   │   ├── NewsFeedUI.ts       # Компонент для отображения новостей
│   │   ├── main.ts             # Точка входа фронтенда
│   │   └── type.ts             # Типы для TypeScript
│   ├── css/
│   │   └── style.css           # Стили приложения
│   ├── public/
│   │   └── sw.js               # Service Worker для кэширования
│   ├── img/                    # Папка для изображений
│   └── index.html              # Основной HTML-шаблон
├── Backend/                    # Папка с серверной частью
│   ├── dist/                   # Скомпилированные файлы сервера
│   ├── node_modules/
│   ├── server.ts               # Сервер на Koa
│   ├── package.json            # Зависимости сервера
│   ├── tsconfig.json           # Настройки TypeScript
│   └── yarn.lock
├── webpack.common.mjs          # Конфигурация Webpack
├── tsconfig.json               # Настройки TypeScript для фронтенда
├── package.json                # Зависимости и скрипты (корневой)
└── README.md                   # Документация
```

### Заметки по реализации

- **Service Worker:** Использует стратегии "Cache First" для статических ресурсов и "Network First" с кэшированием для данных API. Файл `sw.js` кэширует `index.html`, `bundle.js`, и `style.css`, а также поддерживает офлайн-режим с сообщением об ошибке при отсутствии данных.
- **Задержка:** Middleware в `server.ts` добавляет 2-секундную задержку для имитации сетевого трафика.
- **Интерфейс загрузки:** Реализован через класс `NewsFeedUI`, который показывает анимацию до получения данных или при офлайн-режиме.

---

### Ссылки

- **Репозиторий:** [GitHub](https://github.com/dm-morozov/Netology_63_webworkers_serviceworkers/)
- **GitHub Pages:** [https://dm-morozov.github.io/Netology_63_webworkers_serviceworkers/](https://dm-morozov.github.io/Netology_63_webworkers_serviceworkers/)
- **Render API:** [https://netology-63-webworkers-serviceworkers.onrender.com](https://netology-63-webworkers-serviceworkers.onrender.com)

---

## 📧 Контакты

Если возникнут вопросы, пишите:

* ![LinkedIn](./svg/linkedin-icon.svg) [LinkedIn](https://www.linkedin.com/in/dm-morozov/)
* ![Telegram](./svg/telegram.svg) [Telegram](https://t.me/dem2014)
* ![GitHub](./svg/github-icon.svg) [GitHub](https://github.com/dm-morozov/)



