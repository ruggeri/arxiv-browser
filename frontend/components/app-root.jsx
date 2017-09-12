import React from 'react';
import { Provider } from 'react-redux';
import PapersList from './papers/papers-list.jsx';

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <PapersList />
  </Provider>
);

export default AppRoot;
