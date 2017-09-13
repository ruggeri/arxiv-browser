const koaRouter = require('koa-router');

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  ctx.body = {
    papers: {},
    authorships: {},
    authors: {},
  };

  ctx.body.papers = await ctx.models.Paper.findAll(
    {order: [['publicationDateTime', 'DESC']]}
  );

  ctx.body.authorships = await ctx.models.Authorship.findAll(
    {where: {paperId: {$in: ctx.body.papers.map(p => p.id)}}}
  );

  ctx.body.authors = await ctx.models.Author.findAll(
    {where: {id: {$in: ctx.body.authorships.map(as => as.authorId)}}}
  );
});

module.exports = papersRouter;
