/**
 * Frontline Journalist
 */

import { faker } from "@faker-js/faker";
import { Placeholders } from "./placeholder";
import type { Battle, Neta } from "src/types/types";

export class FrontlineJournalist {
  name: string = "";

  constructor(name?: string) {
    this.name = name || "no-name";
  }

  /**
   * Generates a fictional battle report between two Neta entities.
   */
  report(): Battle {
    /**
     * Komae army
     *
     * @example
     *
     * ```
       {
      imageUrl: "https://example.com/images/komae.jpg",
      title: "Komae the Brave",
      subtitle: "Hero of the East",
      description:
        "A fearless warrior known for his strategic mind and unmatched combat skills.",
      power: 95,
    };
    ```
    */
    const komae: Neta = {
      ...Placeholders.Komae,
      power: faker.number.int({ min: 0, max: 100 }),
    };
    /**
     * Yono army
     *
     * @example
     *
     * ```
      {
  imageUrl: "https://example.com/images/yono.jpg",
      title: "Yono the Mighty",
      subtitle: "Defender of the West",
      description:
        "A stalwart defender with a heart of gold and a will of iron.",
      power: 90,
    }
    ```
    */
    const yono: Neta = {
      ...Placeholders.Yono,
      power: faker.number.int({ min: 0, max: 100 }),
    };

    return {
      title: "The Great Battle of 1945",
      subtitle: "A Clash of Titans",
      overview: "An epic battle that changed the course of history.",
      scenario:
        "In the final days of World War II, two legendary figures faced off in a decisive battle that would determine the fate of nations.",
      komae: komae,
      yono: yono,
    };
  }
}
