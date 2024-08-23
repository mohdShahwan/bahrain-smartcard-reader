import { IGDNPR2 } from "../types/smartcard-data";
import processDateString from "../utils/processDateString";
import EF from "./EF";

/*
  This EF contains:
  - Passport number
  - Passport type
  - Passport sequence number
  - Issue date
  - Expiry date
*/

export class GDNPR2 extends EF<IGDNPR2> {
  constructor() {
    super();
    this.size = 47;
    this.selectCommand = "00A4020C020002";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;

    result.passportNumber = this.decodeBytesToText(0, 28);
    result.passportType = this.decodeBytesToText(28, 1);
    result.passportSequenceNumber = this.decodeBytesToText(29, 2);
    result.issueDate = processDateString(this.decodeBytesToText(31, 8));
    result.expiryDate = processDateString(this.decodeBytesToText(39, 8));
  }
}
