import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import PapersList from './papers/papers-list.jsx';
import AuthorShow from './papers/author-show.jsx';

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path="/" component={PapersList}/>
        <Route path="/authors/:authorId" component={AuthorShow}/>
      </div>
    </BrowserRouter>
  </Provider>
);

export default AppRoot;
