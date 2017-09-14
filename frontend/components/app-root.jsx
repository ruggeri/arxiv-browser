import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import PapersIndex from './papers/papers-index.jsx';
import PaperShow from './papers/paper-show.jsx';
import AuthorShow from './authors/author-show.jsx';

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="container">
        <Switch>
          <Redirect exact path="/" to="/papers"/>
          <Route path="/authors/:authorId" component={AuthorShow}/>
          <Switch>
            <Route exact path="/papers" component={PapersIndex}/>
            <Route path="/papers/starred" component={(props) => (
              <PapersIndex filter="starred"/>
            )}/>
            <Route path="/papers/starredAuthors" component={(props) => (
              <PapersIndex filter="starredAuthors"/>
            )}/>
            <Route path="/papers/:paperId" component={PaperShow}/>
          </Switch>
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);

export default AppRoot;
