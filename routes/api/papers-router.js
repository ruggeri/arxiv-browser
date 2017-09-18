const koaRouter = require('koa-router');

async function buildResponse(ctx, papers) {
  ctx.body = {};

  ctx.body.papers = papers;
  const paperIds = papers.map(p => p.id);

  ctx.body.paperStatuses = await ctx.models.PaperStatus.findAll(
    {where: {id: {$in: paperIds}}}
  );

  ctx.body.authorships = await ctx.models.Authorship.findAll(
    {where: {paperId: {$in: paperIds}}}
  );
  const authorIds = ctx.body.authorships.map(as => as.authorId);

  ctx.body.authors = await ctx.models.Author.findAll(
    {where: {id: {$in: authorIds}}}
  );

  ctx.body.authorStatuses = await ctx.models.AuthorStatus.findAll(
    {where: {id: {$in: authorIds}}}
  );
}

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  const papers = await ctx.models.Paper.findAll({
    // select: ['id', 'link', 'title', 'publicationDateTime'],
    order: [['publicationDateTime', 'DESC']],
    limit: 100,
  });

  await buildResponse(ctx, papers);
});

papersRouter.get('/:paperId', async ctx => {
  const papers = await ctx.models.Paper.findAll(
    {where: {id: ctx.params.paperId}}
  );

  await buildResponse(ctx, papers);
});

papersRouter.post('/:paperId/paperStatus/toggleArchived', async ctx => {
  const paperStatus = await ctx.models.PaperStatus.findOne({
    where: {paperId: ctx.params.paperId}
  });

  paperStatus.isArchived = !paperStatus.isArchived;
  await paperStatus.save();

  ctx.body = {paperStatus: paperStatus};
});

papersRouter.post('/:paperId/paperStatus/toggleStar', async ctx => {
  const paperStatus = await ctx.models.PaperStatus.findOne({
    where: {paperId: ctx.params.paperId}
  });

  paperStatus.isStarred = !paperStatus.isStarred;
  await paperStatus.save();

  ctx.body = {paperStatus: paperStatus};
});

module.exports = papersRouter;
