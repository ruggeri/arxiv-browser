const koa = require('koa');
const koaViews = require('koa-views');


const app = new koa();

app.use(koaViews(__dirname + '/views'));

app.use(async ctx => {
  await ctx.render('index.html.pug');
});

app.listen(3000);
