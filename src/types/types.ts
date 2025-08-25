/**
 * Represents a single Neta (ネタ) entity, which is a core unit in the battle system.
 *
 * @property imageUrl - The URL of the image representing the Neta.
 * @property title - The main title or name of the Neta.
 * @property subtitle - A short subtitle or catchphrase for the Neta.
 * @property description - A detailed description of the Neta.
 * @property power - The numeric power value used for battle calculations.
 */
export interface Neta {
  /** The URL of the image representing the Neta. */
  imageUrl: string;
  /** The main title or name of the Neta. */
  title: string;
  /** A short subtitle or catchphrase for the Neta. */
  subtitle: string;
  /** A detailed description of the Neta. */
  description: string;
  /** The numeric power value used for battle calculations. */
  power: number;
}

/**
 * Represents a battle scenario between two Neta entities.
 *
 * @property title - The main title of the battle scenario.
 * @property subtitle - A short subtitle for the scenario.
 * @property overview - A brief overview of the scenario.
 * @property scenario - The detailed scenario description.
 * @property komae - The Neta entity representing Komae.
 * @property yono - The Neta entity representing Yono.
 */
export interface Battle {
  /** The main title of the battle scenario. */
  title: string;
  /** A short subtitle for the scenario. */
  subtitle: string;
  /** A brief overview of the scenario. */
  overview: string;
  /** The detailed scenario description. */
  scenario: string;
  /** The Neta entity representing Komae. */
  komae: Neta;
  /** The Neta entity representing Yono. */
  yono: Neta;
}
