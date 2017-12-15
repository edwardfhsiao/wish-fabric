import 'babel-polyfill';

window.onpageshow = function(event) {
  if (event.persisted) {
    window.location.reload();
  }
};

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import createStore from './store';
import { Provider } from 'react-redux';
import App from 'APP/app';

render(
  <Provider store={createStore()}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
