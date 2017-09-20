import Header from 'components/header.jsx';
import PapersIndex from 'components/papers/papers-index.jsx';
import PaperShow from 'components/papers/paper-show.jsx';
import AuthorShow from 'components/authors/author-show.jsx';
import AuthorsIndex from 'components/authors/authors-index.jsx';
import { ComponentStateProvider } from 'helpers/component-state-store';
import Navigator from 'helpers/navigator.jsx';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

const Routes = () => (
  <Switch>
    <Redirect exact path="/" to="/papers/search"/>

    <Route exact path="/authors/search" component={AuthorsIndex}/>
    <Route exact path="/authors/:authorId" component={AuthorShow}/>

    <Route exact path="/papers/search" component={PapersIndex}/>
    <Route exact path="/papers/:paperId" component={PaperShow}/>
  </Switch>
);

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <ComponentStateProvider>
        <div className="container">
          <Navigator/>
          <Header/>
          <Routes/>
        </div>
      </ComponentStateProvider>
    </BrowserRouter>
  </Provider>
);

export default AppRoot;
