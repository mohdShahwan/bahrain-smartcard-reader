import { IGDT2 } from "../types/smartcard-data";
import processDateString from "../utils/processDateString";
import EF from "./EF";

/*
  This EF contains:
  - Disability code
  - Vision code
*/

export class GDT2 extends EF<IGDT2> {
  constructor() {
    super();
    this.size = 3;
    this.selectCommand = "00A4020C020001";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;

    result.disabilityCode = this.decodeBytesToText(0, 2);
    result.visionCode = this.decodeBytesToText(2, 1);
  }
}
