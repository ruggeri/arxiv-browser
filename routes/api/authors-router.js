const koaRouter = require('koa-router');
const {buildAuthorsResponse} = require('./build-response');

const authorsRouter = new koaRouter();
authorsRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  // TODO: Dirty hack for now...
  ctx.query.isAuthorStarred = ctx.query.isAuthorStarred == "true";
  const authors = await ctx.models.Author.query(ctx.query);

  await buildAuthorsResponse(ctx, authors);
});

authorsRouter.get('/:authorId', async ctx => {
  const authors = await ctx.models.Author.findByIds([
    ctx.params.authorId
  ]);

  await buildAuthorsResponse(ctx, authors, {includeCoAuthors: true});
});

authorsRouter.post('/:authorId/authorStatus/toggleStar', async ctx => {
  const authorStatus = await ctx.models.AuthorStatus.toggleStarred(
    ctx.params.authorId
  );
  ctx.body = {authorStatus: authorStatus};
});

module.exports = authorsRouter;
