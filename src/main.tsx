import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import App from '@/App.tsx';
import { HistoricalSeedProvider } from '@/yk/repo/seed-system/historical-seed-store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HistoricalSeedProvider>
      <App />
    </HistoricalSeedProvider>
  </StrictMode>,
);
