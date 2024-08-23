import { ICPR6 } from "../types/smartcard-data";
import EF from "./EF";

/*
  This EF contains:
  - Occupation description in English and Arabic
  - Employer number
  - Employer name in English and Arabic
  - Employer flag
  - Employment flag
  - Sponsor CPR number or Unit number
  - Sponsor name in English and Arabic
  - Sponsor flag
  - Labor force participation
  - Latest education degree in English and Arabic
  - Clearing agent indicator
*/

export class CPR6 extends EF<ICPR6> {
  constructor() {
    super();
    this.size = 1590;
    this.selectCommand = "00A4020C020006";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;

    result.occupationDescriptionEn = this.decodeBytesToText(0, 64);
    result.occupationDescriptionAr = this.decodeBytesToText(64, 128);
    result.employerNumber = this.decodeBytesToText(192, 9);
    result.employerNameEn = this.decodeBytesToText(201, 197);
    result.employerNameAr = this.decodeBytesToText(398, 394);
    result.employerFlag = this.decodeBytesToText(792, 1);
    result.employmentFlag = this.decodeBytesToText(793, 1);
    result.sponsorCPRNumberOrUnitNumber = this.decodeBytesToText(794, 9);
    result.sponsorNameEn = this.decodeBytesToText(803, 197);
    result.sponsorNameAr = this.decodeBytesToText(1000, 394);
    result.sponsorFlag = this.decodeBytesToText(1394, 1);
    result.laborForceParticipation = this.decodeBytesToText(1395, 2);
    result.latestEducationDegreeEn = this.decodeBytesToText(1397, 64);
    result.latestEducationDegreeAr = this.decodeBytesToText(1461, 128);
    result.clearingAgentIndicator = this.decodeBytesToText(1589, 1);
  }
}
