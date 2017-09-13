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
    const authorsForPaper = authorIds.map(id => state.authors.get(id));

    authorsByPaperId = authorsByPaperId.merge(
      I.Map([[paperId, authorsForPaper]])
    );
  }

  return authorsByPaperId;
};
