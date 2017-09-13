const koaRouter = require('koa-router');
const apiRouter = require(__dirname + '/api-router.js');

// Routes
const rootRouter = new koaRouter();

rootRouter.get('/', async ctx => {
  await ctx.render('index.html.pug');
});

rootRouter.use('/api', apiRouter.routes());

module.exports = rootRouter;
