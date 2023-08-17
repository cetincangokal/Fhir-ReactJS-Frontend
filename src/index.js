import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import { Provider } from 'react-redux';
import App from './App'; // Your root component
import store from './store/Store'; // Your Redux store
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const rootElement = document.getElementById('root');

// Use createRoot to render your app
const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
  </Provider>
);
