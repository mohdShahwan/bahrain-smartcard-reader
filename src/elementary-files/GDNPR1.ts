import { ICPR6, IGDNPR1 } from "../types/smartcard-data";
import EF from "./EF";

/*
  This EF contains:
  - 
*/

export class GDNPR1 extends EF<IGDNPR1> {
  constructor() {
    super();
    this.size = 6;
    this.selectCommand = "00A4020C020001";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;

    result.nationality = this.decodeBytesToText(0, 3);
    result.birthCountry = this.decodeBytesToText(3, 3);
  }
}
