import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PapersIndex from './papers/papers-index.jsx';
import PaperShow from './papers/paper-show.jsx';
import AuthorShow from './authors/author-show.jsx';

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="container">
        <Switch>
          <Route exact path="/" component={PapersIndex}/>
          <Route path="/authors/:authorId" component={AuthorShow}/>
          <Route path="/papers/:paperId" component={PaperShow}/>
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);

export default AppRoot;
