import { _paperId } from 'queries/paper';
import I from 'immutable';

export function _authorId({author, authorId}) {
  if (author) {
    authorId = author.get('id');
  }

  if (!authorId) {
    throw "No paper id given?";
  }

  return authorId;
}

export const getAllAuthors = (state) => {
  return state.authors.valueSeq().toList().sortBy(a => a.get('name'));
}

export const authorsForPaper = (state, paperOrId) => {
  const paperId = _paperId(paperOrId);

  const authorshipsByPaperId = state.authorships.get('byPaperId');
  const authorships = authorshipsByPaperId.get(paperId, I.Set());
  const authors = authorships.map(
    as => state.authors.get(as.get('authorId'))
  ).filter(a => !!a).sortBy(a => a.get('name'));

  return authors;
}

export const getAuthorById = (state, authorId) => {
  return state.authors.get(authorId);
}

export const isAuthorStarred = (state, authorOrId) => {
  const authorId = _authorId(authorOrId);

  const authorStatus = state.authorStatuses.get(authorId);
  return authorStatus && authorStatus.get('isStarred');
}

export const searchAuthors = (state, queryObj, authors) => {
  return authors.filter(author => {
    const nameMatches = (
      author.get('name').toLowerCase().includes(queryObj.query)
    );

    if (!nameMatches) {
      return false;
    }

    if (!queryObj.isAuthorStarred) {
      return true;
    } else {
      return isAuthorStarred(author);
    }
  }).toList();
}
