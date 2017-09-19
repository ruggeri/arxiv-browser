const koaRouter = require('koa-router');
const {buildPapersResponse} = require('./build-response');

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  // TODO: Dirty hack for now...
  ctx.query.isAuthorStarred = ctx.query.isAuthorStarred == 'true';
  ctx.query.isPaperStarred = ctx.query.isPaperStarred == 'true';

  const papers = await ctx.models.Paper.query(ctx.query);
  await buildPapersResponse(ctx, papers);
});

papersRouter.get('/:paperId', async ctx => {
  const papers = await ctx.models.Paper.findByIds([ctx.params.paperId]);
  await buildPapersResponse(ctx, papers);
});

papersRouter.post('/:paperId/paperStatus/toggleState', async ctx => {
  const paperStatus = await ctx.models.PaperStatus.toggleState(
    ctx.params.paperId,
    ctx.query.state,
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
