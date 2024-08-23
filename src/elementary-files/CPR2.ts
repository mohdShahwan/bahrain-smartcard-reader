import { ICPR2, SmartcardData } from "../types/smartcard-data";
import processDateString from "../utils/processDateString";
import EF from "./EF";

/*
  This EF contains:
  - Card Expiry Date
  - Card Issue Date
  - Issuing Authority
*/

export class CPR2 extends EF<ICPR2> {
  constructor() {
    super();
    this.size = 36;
    this.selectCommand = "00A4020C020002";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;

    result.cardExpiryDate = processDateString(this.decodeBytesToText(0, 8));
    result.cardIssueDate = processDateString(this.decodeBytesToText(8, 8));
    result.issuingAuthority = this.decodeBytesToText(16, 20);
  }
}