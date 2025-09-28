// server.ts

import Koa from 'koa';
// В Koa для обработки JSON-тела ответа лучше использовать koa-json.
// Для простоты, мы сейчас явно устанавливаем заголовок Content-Type.
import { v4 as uuidv4 } from 'uuid'; // Для генерации ID

const app = new Koa();

// --- Middleware: Добавление Задержки 2 секунды (имитация сетевого трафика) ---
app.use(async (ctx, next) => {
    // Установим CORS-заголовок, чтобы фронтенд мог обращаться к серверу
    ctx.set('Access-Control-Allow-Origin', '*'); 
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    await next();
});

// --- Middleware: Обработка маршрута /news ---
app.use(ctx => {
    // Проверяем только путь /news
    if (ctx.path === '/news') {
        // Устанавливаем заголовок Content-Type для правильной интерпретации JSON
        ctx.type = 'application/json'; 

        // Генерируем данные, соответствующие нашему интерфейсу NewsItem
        const now = Date.now();
        
        // ВАЖНО: Description, который содержит '\n', должен быть обработан на клиенте,
        // но для простоты я делаю его одной строкой.
        const news = [
            { 
                id: uuidv4(), // Генерация уникального ID
                title: 'Премьера года: "Крылья Свободы"', 
                description: 'Новый блокбастер установил рекорд по кассовым сборам в первый уикенд и получил восторженные отзывы критиков и зрителей.', 
                image: 'https://picsum.photos/100/100?random=1',
                date: now - 3600000 
            },
            { 
                id: uuidv4(),
                title: 'Интервью с режиссером А. Смитом', 
                description: 'Знаменитый режиссер рассказал о своих планах на следующий проект и о трудностях во время съемок в условиях изоляции.', 
                image: 'https://picsum.photos/100/100?random=2', 
                date: now - 7200000 
            },
            { 
                id: uuidv4(),
                title: 'Аналитика рынка кино', 
                description: 'Эксперты обсуждают тенденции развития киноиндустрии в ближайшем будущем и рост популярности стриминговых сервисов.', 
                image: 'https://picsum.photos/100/100?random=3', 
                date: now - 10800000 
            }
        ];
        
        // Оборачиваем данные в ApiResponse (хотя для Koa можно и напрямую массив)
        // Но для соответствия нашему фронтенду, лучше вернуть структурированный ответ:
        ctx.body = {
             status: 'ok',
             data: news
        };
        
    } else if (ctx.path === '/') {
        // Если это корневой запрос, просто приветствие
        ctx.body = 'Hello, world! Use /news to get data.';
    } else {
        // Для всех остальных маршрутов
        ctx.status = 404;
        ctx.body = { status: 'error', message: 'Not Found' };
    }
});

app.listen(process.env.PORT || 3030, () => console.log('Server running on Render.com'));