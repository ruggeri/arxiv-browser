import I from 'immutable';

export const authorsByPaperId = (state, papers) => {
  const authorshipsByPaperId = state.authorships.get('byPaperId');

  let paperIds;
  if (I.isAssociative(papers)) {
    paperIds = papers.keySeq();
  } else {
    paperIds = papers;
  }

  let authorsByPaperId = I.Map();
  for (const paperId of paperIds) {
    const authorIds = (
      authorshipsByPaperId.get(paperId).map(as => as.get('authorId'))
    );
    let authorsForPaper = authorIds.map(id => state.authors.get(id));
    authorsForPaper = authorsForPaper.sortBy(a => a.get('name'));

    authorsByPaperId = authorsByPaperId.merge(
      I.Map([[paperId, authorsForPaper]])
    );
  }

  return authorsByPaperId;
};

export const papersForAuthorId = (state, authorId) => {
  const authorshipsByAuthorId = state.authorships.get('byAuthorId');
  const authorships = authorshipsByAuthorId.get(authorId);
  let papers = authorships.map(as => state.papers.get(as.get('paperId')));
  papers = papers.sortBy(p => p.get('publicationDateTime'));

  return papers
};