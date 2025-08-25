/**
 * Frontline Journalist
 */

import { faker } from "@faker-js/faker";
import { Placeholders } from "./placeholder";
import { uid } from "@/lib/id";
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
      id: uid("battle"),
      title:
        "The Great Battle of " + faker.number.int({ min: 1990, max: 2050 }),
      subtitle: faker.lorem.words({ min: 2, max: 5 }),
      overview: "An epic battle that changed the course of history.",
      scenario: faker.lorem.paragraph(),
      komae: komae,
      yono: yono,
      status: "success",
    };
  }
}
