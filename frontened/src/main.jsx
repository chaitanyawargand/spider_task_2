import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ActivityProvider } from './context/activityContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <ActivityProvider>
        <App />
      </ActivityProvider>
  </BrowserRouter>
);
