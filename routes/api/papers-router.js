const koaRouter = require('koa-router');

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  const papers = await ctx.models.Paper.findAll(
    {order: [['publicationDateTime', 'DESC']]}
  );

  ctx.body = {}
  for (paper of papers) {
    ctx.body[paper.link] = paper.toJSON();
  }
});

module.exports = papersRouter;
