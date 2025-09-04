/**
 * Represents a single historical seed - a piece of historical evidence or context
 * that can be used to generate battle scenarios.
 */
export interface HistoricalSeed {
  /** Unique identifier for this historical seed */
  id: string;
  /** The main title of this historical event or evidence */
  title: string;
  /** A brief subtitle or tagline */
  subtitle: string;
  /** A short overview of the historical context */
  overview: string;
  /** Detailed narrative describing the historical evidence */
  narrative: string;
  /** Array of provenance information citing sources */
  provenance?: Array<{
    /** Label describing the source type */
    label: string;
    /** Optional URL to the source */
    url?: string;
    /** Optional note about the source */
    note?: string;
  }>;
}

/**
 * Metadata for a historical seed, used for discovery and listing.
 */
export interface HistoricalSeedMeta {
  /** The unique identifier of the seed */
  id: string;
  /** The display title of the seed */
  title: string;
  /** The file path this seed can be loaded from */
  file: string;
}
