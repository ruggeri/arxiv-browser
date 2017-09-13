import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import PapersList from './papers/papers-list.jsx';

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/" component={PapersList}/>
    </BrowserRouter>
  </Provider>
);

export default AppRoot;
