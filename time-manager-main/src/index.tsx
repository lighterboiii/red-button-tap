import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TimeManager from './components/TimeManager/TimeManager';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TimeManager />
  </React.StrictMode>
);
reportWebVitals();
