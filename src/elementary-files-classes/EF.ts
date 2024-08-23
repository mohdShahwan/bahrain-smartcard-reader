// T here is the type of object, this type can be one of the EF files result
// Example: ICPR1, ICPR2, .....

import { SmartcardData } from "../types/smartcard-data";

export default class EF<T> {
  size?: number;
  selectCommand?: string;
  buffer?: Uint8Array;
  result?: T;
  static smartcardData?: SmartcardData;

  populateResult() {}

  assembleData() {
    EF.smartcardData = { ...EF.smartcardData, ...this.result };
  }

  decodeBytesToText(start: number, length: number): string {
    // Create a new array with (length) elements
    let numArray = new Uint8Array(length);
    // Copy length bytes from 'this.buffer' starting at index (start) into 'numArray'
    numArray.set(this.buffer.slice(start, start + length), 0);
    // Convert the byte array to a string, trim any trailing spaces, and remove null characters
    return new TextDecoder("utf-8").decode(numArray).replace(/\0/g, "").trim();
  }
}
