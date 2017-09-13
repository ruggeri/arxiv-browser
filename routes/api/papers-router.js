const koaRouter = require('koa-router');

async function buildResponse(ctx, papers) {
  ctx.body = {};

  ctx.body.papers = papers;
  ctx.body.paperStatuses = await ctx.models.PaperStatus.findAll(
    {where: {id: {$in: papers.map(p => p.id)}}}
  );

  ctx.body.authorships = await ctx.models.Authorship.findAll(
    {where: {paperId: {$in: papers.map(p => p.id)}}}
  );

  ctx.body.authors = await ctx.models.Author.findAll(
    {where: {id: {$in: ctx.body.authorships.map(as => as.authorId)}}}
  );

  ctx.body.authorStatuses = await ctx.models.AuthorStatus.findAll(
    {where: {id: {$in: ctx.body.authorships.map(as => as.authorId)}}}
  );
}

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  const papers = await ctx.models.Paper.findAll(
    {order: [['publicationDateTime', 'DESC']]}
  );

  await buildResponse(ctx, papers);
});

papersRouter.get('/:paperId', async ctx => {
  const papers = await ctx.models.Paper.findAll(
    {where: {id: ctx.params.paperId}}
  );

  await buildResponse(ctx, papers);
})

module.exports = papersRouter;
