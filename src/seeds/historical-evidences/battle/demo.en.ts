import type { Battle } from '@/types/types';

const battle = {
  id: 'demo-battle-001',
  title: 'Demo Historical Battle',
  subtitle: 'Sample for repository tests',
  overview: 'A minimal, well-formed Battle object for tests.',
  scenario:
    'This is a demo scenario used by tests to verify repository loading.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Komae',
    subtitle: 'Demo neta',
    description: 'Demo description for Komae',
    power: 50,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Yono',
    subtitle: 'Demo neta',
    description: 'Demo description for Yono',
    power: 50,
  },
  provenance: [
    { label: 'Test Fixture', note: 'Used by repository-provider test.' },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
