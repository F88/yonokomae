/**
 * Represents a single Neta (ネタ) entity, which is a core unit in the battle system.
 */
export interface Neta {
  /** The URL of the image representing the Neta */
  imageUrl: string;
  /** The main title or name of the Neta */
  title: string;
  /** A short subtitle or catchphrase for the Neta */
  subtitle: string;
  /** A detailed description of the Neta */
  description: string;
  /** The numeric power value used for battle calculations */
  power: number;
}

/**
 * Represents a battle scenario between two Neta entities.
 */
export interface Battle {
  /** Stable unique id for list keys and tracking */
  id: string;
  /** The main title of the battle scenario */
  title: string;
  /** A short subtitle for the scenario */
  subtitle: string;
  /** A brief overview of the scenario */
  overview: string;
  /** The detailed scenario description */
  scenario: string;
  /** The Neta entity representing Komae */
  komae: Neta;
  /** The Neta entity representing Yono */
  yono: Neta;
  /** Optional provenance/citations for historical evidence */
  provenance?: Array<{
    label: string;
    url?: string;
    note?: string;
  }>;
  /** Optional status for UI flow control */
  status?: 'loading' | 'success' | 'error';
}
