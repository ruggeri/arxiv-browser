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
    {where: {paperLink: {$in: ctx.body.papers.map(p => p.link)}}}
  );

  ctx.body.authors = await ctx.models.Author.findAll(
    {where: {name: {$in: ctx.body.authorships.map(as => as.authorName)}}}
  );
});

module.exports = papersRouter;
