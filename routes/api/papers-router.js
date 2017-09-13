const koaRouter = require('koa-router');

const papersRouter = new koaRouter();
papersRouter.get('/', async ctx => {
  // TODO: eventually I will want to paginate this...
  ctx.body = {
    papers: {},
    authorships: {},
    authors: {},
  };

  const papers = await ctx.models.Paper.findAll(
    {order: [['publicationDateTime', 'DESC']]}
  );
  for (paper of papers) {
    ctx.body.papers[paper.link] = paper.toJSON();
  }

  const authorships = await ctx.models.Authorship.findAll(
    {where: {paperLink: {$in: papers.map(p => p.link)}}}
  );
  for (authorship of authorships) {
    ctx.body.authorships[authorship.paperLink] = authorship.toJSON();
  }

  const authors = await ctx.models.Author.findAll(
    {where: {name: {$in: authorships.map(as => as.authorName)}}}
  );
  for (author of authors) {
    ctx.body.authors[author.name] = author.toJSON();
  }
});

module.exports = papersRouter;
