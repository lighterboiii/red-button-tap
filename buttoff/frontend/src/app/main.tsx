import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@shared/types/telegram-web-app';
import { App } from './App';

const el = document.getElementById('root');
if (!el) throw new Error('root missing');

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
