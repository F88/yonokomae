/**
 * Judge class for determining the winner between two fighters.
 */

import type { Neta } from "src/types/types";

export class Judge {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // static determineWinner(yonoPower: number, komaePower: number): string {
  static determineWinner({ yono, komae }: { yono: Neta; komae: Neta }): string {
    if (yono.power > komae.power) {
      return "YONO wins!";
    } else if (yono.power < komae.power) {
      return "KOMAE wins!";
    } else {
      return "It's a tie!";
    }
  }
}
