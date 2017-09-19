const koaRouter = require('koa-router');

async function buildResponse(ctx, papers) {
  ctx.body = {};

  ctx.body.papers = papers;
  const paperIds = papers.map(p => p.id);

  ctx.body.paperStatuses = await ctx.models.PaperStatus.findByIds(
    paperIds
  );

  ctx.body.authorships = await ctx.models.Authorship.findByIds(
    'paperId', paperIds
  );
  const authorIds = ctx.body.authorships.map(as => as.authorId);

  ctx.body.authors = await ctx.models.Author.findByIds(authorIds);

  ctx.body.authorStatuses = await ctx.models.AuthorStatus.findByIds(
    authorIds
  );
}

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  // TODO: Dirty hack for now...
  ctx.query.isAuthorStarred = ctx.query.isAuthorStarred == 'true';
  ctx.query.isPaperStarred = ctx.query.isPaperStarred == 'true';

  const papers = await ctx.models.Paper.query(ctx.query);
  await buildResponse(ctx, papers);
});

papersRouter.get('/:paperId', async ctx => {
  const papers = await ctx.models.Paper.findByIds([ctx.params.paperId]);
  await buildResponse(ctx, papers);
});

papersRouter.post('/:paperId/paperStatus/toggleArchived', async ctx => {
  const paperStatus = await ctx.models.PaperStatus.toggleArchived(
    ctx.params.paperId
  );
  ctx.body = {paperStatus: paperStatus};
});

papersRouter.post('/:paperId/paperStatus/toggleStar', async ctx => {
  const paperStatus = await ctx.models.PaperStatus.toggleStarred(
    ctx.params.paperId
  );
  ctx.body = {paperStatus: paperStatus};
});

module.exports = papersRouter;
