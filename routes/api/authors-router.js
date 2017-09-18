const koaRouter = require('koa-router');

async function buildResponse(ctx, authors) {
  ctx.body = {};

  ctx.body.authors = authors;
  const authorIds = authors.map(a => a.id);

  ctx.body.authorships = await ctx.models.Authorship.findAll(
    {where: {authorId: {$in: authorIds}}}
  );

  ctx.body.authorStatuses = await ctx.models.AuthorStatus.findAll(
    {where: {authorId: {$in: authorIds}}}
  );
  const paperIds = ctx.body.authorships.map(as => as.paperId);

  ctx.body.papers = await ctx.models.Paper.findAll({
    // select: ['id', 'link', 'title', 'publicationDateTime'],
    where: {id: {$in: paperIds}},
    order: [['publicationDateTime', 'DESC']],
  });

  ctx.body.paperStatuses = await ctx.models.PaperStatus.findAll(
    {where: {id: {$in: paperIds}}}
  );
}

const authorsRouter = new koaRouter();
authorsRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  const authors = await ctx.models.Author.findAll({
    limit: 100,
  });

  await buildResponse(ctx, authors);
});

authorsRouter.get('/:authorId', async ctx => {
  const authors = await ctx.models.Author.findAll({
    where: {id: ctx.params.authorId}
  });

  await buildResponse(ctx, authors);
});

authorsRouter.post('/:authorId/authorStatus/toggleStar', async ctx => {
  const authorStatus = await ctx.models.AuthorStatus.findOne({
    where: {authorId: ctx.params.authorId}
  });

  authorStatus.isStarred = !authorStatus.isStarred;
  await authorStatus.save();

  ctx.body = {authorStatus: authorStatus};
});

module.exports = authorsRouter;
