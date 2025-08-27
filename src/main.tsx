import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import App from '@/App.tsx';
import { HistoricalSeedProvider } from '@/yk/repo/seed-system';
import { UserVoices } from '@/components/UserVoices';
import { UsageExamples } from '@/components/UsageExamples';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HistoricalSeedProvider>
      <div style={{ display: 'grid', gap: 12, padding: 12 }}>
        <UserVoices intervalMs={3500} />
        <UsageExamples intervalMs={3500} />
      </div>
      <App />
    </HistoricalSeedProvider>
  </StrictMode>,
);
