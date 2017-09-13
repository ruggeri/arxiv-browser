const koaRouter = require('koa-router');

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  const paper = await ctx.models.Paper.findOne()
  ctx.body = {
    [paper.id]: paper
  };
});

module.exports = papersRouter;
