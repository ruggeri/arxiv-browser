import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import PapersIndex from './papers/papers-index.jsx';
import AuthorShow from './papers/author-show.jsx';

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path="/" component={PapersIndex}/>
        <Route path="/authors/:authorId" component={AuthorShow}/>
      </div>
    </BrowserRouter>
  </Provider>
);

export default AppRoot;
