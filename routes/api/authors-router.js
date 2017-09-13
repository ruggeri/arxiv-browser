const koaRouter = require('koa-router');

const authorsRouter = new koaRouter();
authorsRouter.get('/:authorId', async ctx => {
  ctx.body = {
    authors: {},
    authorships: {},
    papers: {},
  };

  const author = await ctx.models.Author.findById(ctx.params.authorId)
  ctx.body.authors = [author.toJSON()];

  ctx.body.authorships = await ctx.models.Authorship.findAll(
    {where: {authorId: ctx.params.authorId}}
  );

  ctx.body.authorStatuses = await ctx.models.AuthorStatus.findAll(
    {where: {authorId: ctx.params.authorId}}
  );

  ctx.body.papers = await ctx.models.Paper.findAll(
    {
      where: {id: {$in: ctx.body.authorships.map(as => as.paperId)}},
      order: [['publicationDateTime', 'DESC']]
    }
  );

  ctx.body.paperStatuses = await ctx.models.PaperStatus.findAll(
    {where: {id: {$in: ctx.body.authorships.map(as => as.paperId)}}}
  );
});

module.exports = authorsRouter;
