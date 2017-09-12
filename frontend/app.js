import React from 'react';
import ReactDOM from 'react-dom';
import AppRoot from './components/app-root.jsx';
import { getStore } from './store/store.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const store = getStore();
  ReactDOM.render(<AppRoot store={store} />, root);
});
