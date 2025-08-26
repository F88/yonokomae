import type { Battle } from '@/types/types';

const battle: Battle = {
  id: 'demo-battle-001',
  title: 'Demo Historical Battle',
  subtitle: 'File-based sample',
  overview: 'A sample battle loaded from a TS file.',
  scenario: 'Two forces met at the river crossing and exchanged pleasantries.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Komae Demo',
    subtitle: 'Sample',
    description: 'Demo neta from file',
    power: 42,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Yono Demo',
    subtitle: 'Sample',
    description: 'Demo neta from file',
    power: 58,
  },
  provenance: [{ label: 'Demo Source', note: 'File-based test fixture' }],
  status: 'success',
};

export default battle;
