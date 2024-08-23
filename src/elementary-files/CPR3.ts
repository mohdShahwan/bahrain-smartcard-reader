import { ICPR3, SmartcardData } from "../types/smartcard-data";
import { arrayBufferToBase64 } from "../utils/arrayBufferToBase64";
import EF from "./EF";

/*
  This EF contains:
  - Photo
  - Signature
*/

export class CPR3 extends EF<ICPR3> {
  constructor() {
    super();
    this.size = 6000;
    this.selectCommand = "00A4020C020003";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;

    result.photo = arrayBufferToBase64(this.buffer.subarray(0, 4000));
    result.signature = arrayBufferToBase64(this.buffer.subarray(4000, 6000));
  }
}