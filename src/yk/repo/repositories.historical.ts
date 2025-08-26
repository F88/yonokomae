import type { ScenarioRepository, NetaRepository } from './repositories';
import type { Neta } from '@/types/types';

export class HistoricalScenarioRepository implements ScenarioRepository {
  async generateTitle(): Promise<string> {
    return 'Battle of Tama River';
  }
  async generateSubtitle(): Promise<string> {
    return 'A Turning Point in Regional History';
  }
  async generateOverview(): Promise<string> {
    return 'Based on documented events and testimonies.';
  }
  async generateNarrative(): Promise<string> {
    return 'Eyewitness accounts describe a fierce clash near the river banks.';
  }
}

export class HistoricalNetaRepository implements NetaRepository {
  async getKomaeBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    return {
      imageUrl: 'https://placehold.co/200x100?text=K',
      title: 'Komae Battalion',
      subtitle: 'Veterans of the East',
      description: 'Local militia with strong defensive tactics.',
    };
  }
  async getYonoBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    return {
      imageUrl: 'https://placehold.co/200x100?text=Y',
      title: 'Yono Guard',
      subtitle: 'Defenders of the West',
      description: 'Organized unit trained in river crossing maneuvers.',
    };
  }
}
