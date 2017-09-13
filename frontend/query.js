import I from 'immutable';

export const authorsByPaperLinks = (state, papers) => {
  const authorshipsByPaperLink = state.authorships.get('byPaperLink');

  let paperLinks;
  if (I.isAssociative(papers)) {
    paperLinks = papers.keySeq();
  } else {
    paperLinks = papers;
  }

  let authorsByPaperLinks = I.Map();
  for (const paperLink of paperLinks) {
    const authorNames = (
      authorshipsByPaperLink.get(paperLink).map(as => as.get('authorName'))
    );
    const authorsForLink = authorNames.map(an => state.authors.get(an));

    authorsByPaperLinks = (
      authorsByPaperLinks.merge({[paperLink]: authorsForLink})
    );
  }

  return authorsByPaperLinks;
};
