import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import { Provider } from 'react-redux';
import App from './App'; // Your root component
import store from './store/Store'; // Your Redux store

const rootElement = document.getElementById('root');

// Use createRoot to render your app
const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
