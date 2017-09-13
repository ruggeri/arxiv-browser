import { Map } from 'immutable';
import { RECEIVE_AUTHOR, RECEIVE_AUTHORS } from '../actions/author-actions';

const authorsReducer = (state = Map(), action) => {
  switch (action.type) {
  case RECEIVE_AUTHOR:
    state = state.update(action.author.name, Map(action.author));
  case RECEIVE_AUTHORS:
    for (let author of action.authors) {
      state = state.merge({[author.name]: Map(author)});
    }
  }

  return state;
};

export default authorsReducer;
