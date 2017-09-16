import Header from 'components/header.jsx';
import PapersIndex from 'components/papers/papers-index.jsx';
import PaperShow from 'components/papers/paper-show.jsx';
import AuthorShow from 'components/authors/author-show.jsx';
import AuthorsIndex from 'components/authors/authors-index.jsx';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';


const Routes = () => (
  <Switch>
    <Redirect exact path="/" to="/papers"/>

    <Route exact path="/authors" component={AuthorsIndex}/>
    <Route exact path="/authors/starred" component={(props) => (
      <AuthorsIndex filterName="starred"/>
    )}/>
    <Route exact path="/authors/:authorId" component={AuthorShow}/>
    <Route exact path="/authors/starred/papers" component={(props) => (
      <PapersIndex filterName="starredAuthors"/>
    )}/>

    <Route exact path="/papers" component={PapersIndex}/>
    <Route exact path="/papers/starred" component={(props) => (
      <PapersIndex filterName="starred"/>
    )}/>
    <Route exact path="/papers/:paperId" component={PaperShow}/>
  </Switch>
);

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="container">
        <Header/>
        <Routes />
      </div>
    </BrowserRouter>
  </Provider>
);

export default AppRoot;
