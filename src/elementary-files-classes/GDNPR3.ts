import { IGDNPR3 } from "../types/smartcard-data";
import processDateString from "../utils/processDateString";
import EF from "./EF";

/*
  This EF contains:
  - Visa number
  - Visa expiry date
  - Visa type
  - Resident permit number
  - Resident permit expiry date
  - Type of resident
*/

export class GDNPR3 extends EF<IGDNPR3> {
  constructor() {
    super();
    this.size = 33;
    this.selectCommand = "00A4020C020003";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;

    result.visaNumber = this.decodeBytesToText(0, 7);
    result.visaExpiryDate = processDateString(this.decodeBytesToText(7, 8));
    result.visaType = this.decodeBytesToText(15, 2);
    result.residentPermitNumber = this.decodeBytesToText(17, 7);
    result.residentPermitExpiryDate = processDateString(
      this.decodeBytesToText(24, 8)
    );
    result.typeOfResident = this.decodeBytesToText(32, 1);
  }
}
