// Type definitions for javascript-color-gradient v1.3.2
// Project: https://github.com/Adrinlol/javascript-color-gradient
// Definitions by: Wilson Chua <https://github.com/wilsoncwc/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'javascript-color-gradient' {
  export = Gradient;
  class Gradient {
    constructor(gradients?: string, maxNum?: number, color?: string[], intervals?: any[]);
    setGradient(...args: string[]): Gradient;
    getArray(): string[];
    getColor(index: number): string;
    setMidpoint(maxNumber: number): Gradient;
  }
}
