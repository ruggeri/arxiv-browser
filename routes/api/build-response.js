async function buildPapersResponse(ctx, papers) {
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

async function buildAuthorsResponse(ctx, authors, options = {}) {
  const {includeCoAuthors} = options;
  const authorIds = authors.map(a => a.id);

  if (includeCoAuthors) {
    const papers = await ctx.models.Paper.findForAuthorIds(authorIds);
    return await buildPapersResponse(ctx, papers);
  }

  ctx.body = {};

  ctx.body.authors = authors;

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

module.exports = {
  buildAuthorsResponse,
  buildPapersResponse
};
