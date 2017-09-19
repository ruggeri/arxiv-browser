const koaRouter = require('koa-router');

async function buildResponse(ctx, authors) {
  ctx.body = {};

  ctx.body.authors = authors;
  const authorIds = authors.map(a => a.id);

  ctx.body.authorships = await ctx.models.Authorship.findByIds(
    'authorId', authorIds
  );

  ctx.body.authorStatuses = await ctx.models.AuthorStatus.findByIds(
    authorIds
  );

  const paperIds = ctx.body.authorships.map(as => as.paperId);
  ctx.body.papers = await ctx.models.Paper.findByIds(
    paperIds
  );

  ctx.body.paperStatuses = await ctx.models.PaperStatus.findByIds(
    paperIds
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
  const authors = await ctx.models.Author.findByIds([
    ctx.params.authorId
  ]);

  await buildResponse(ctx, authors);
});

authorsRouter.post('/:authorId/authorStatus/toggleStar', async ctx => {
  const authorStatus = await ctx.models.AuthorStatus.toggleStarred(
    ctx.params.authorId
  );
  ctx.body = {authorStatus: authorStatus};
});

module.exports = authorsRouter;
