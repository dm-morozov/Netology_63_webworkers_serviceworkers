// server.ts

import Koa from 'koa';

const app = new Koa();

app.use(async (ctx, next) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 сек
    await next();
});

app.use(ctx => {
    if (ctx.path === '/news') {
        ctx.body = [
            { title: 'Новость 1', description: 'Строка один\nСтрока два', image: 'https://via.placeholder.com/100' },
            { title: 'Новость 2', description: 'Строка один\nСтрока два', image: 'https://via.placeholder.com/100' },
            { title: 'Новость 3', description: 'Строка один\nСтрока два', image: 'https://via.placeholder.com/100' }
        ];
    } else {
        ctx.status = 404;
    }
});

app.use((ctx: Koa.Context) => {
  ctx.body = 'Hello, world!';
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));