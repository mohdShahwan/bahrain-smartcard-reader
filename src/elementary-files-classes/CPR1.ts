import { ICPR1 } from "../types/smartcard-data";
import processDateString from "../utils/processDateString";
import EF from "./EF";

/*
  This EF contains:
  - CPR Number
  - Full name in English and Arabic
  - Gender
  - Birth Date
  - Blood Group
*/

type bloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export class CPR1 extends EF<ICPR1> {
  constructor() {
    super();
    this.size = 597;
    this.selectCommand = "00A4020C020001";
    this.buffer = new Uint8Array(this.size);
    this.result = {};
  }

  populateResult() {
    const result = this.result;
    const decodedCprNumber = this.decodeBytesToText(0, 9);
    // CPR number
    result.cprNumber =
      decodedCprNumber.length === 8 ? "0" + decodedCprNumber : decodedCprNumber;

    // Full name in English
    result.firstNameEn = this.decodeBytesToText(9, 32);
    result.middleNameEn1 = this.decodeBytesToText(41, 32);
    result.middleNameEn2 = this.decodeBytesToText(73, 32);
    result.middleNameEn3 = this.decodeBytesToText(105, 32);
    result.middleNameEn4 = this.decodeBytesToText(137, 32);
    result.lastNameEn = this.decodeBytesToText(169, 32);
    const {
      firstNameEn,
      middleNameEn1,
      middleNameEn2,
      middleNameEn3,
      middleNameEn4,
      lastNameEn,
    } = result;
    result.fullNameEn = `${firstNameEn} ${
      middleNameEn1 ? middleNameEn1 + " " : ""
    }${middleNameEn2 ? middleNameEn2 + " " : ""}${
      middleNameEn3 ? middleNameEn3 + " " : ""
    }${middleNameEn4 ? middleNameEn4 + " " : ""}${lastNameEn}`;

    // Full name in Arabic
    result.firstNameAr = this.decodeBytesToText(201, 64);
    result.middleNameAr1 = this.decodeBytesToText(256, 64);
    result.middleNameAr2 = this.decodeBytesToText(329, 64);
    result.middleNameAr3 = this.decodeBytesToText(393, 64);
    result.middleNameAr4 = this.decodeBytesToText(457, 64);
    result.lastNameAr = this.decodeBytesToText(521, 64);
    const {
      firstNameAr,
      middleNameAr1,
      middleNameAr2,
      middleNameAr3,
      middleNameAr4,
      lastNameAr,
    } = result;
    result.fullNameAr = `${firstNameAr} ${
      middleNameAr1 ? middleNameAr1 + " " : ""
    }${middleNameAr2 ? middleNameAr2 + " " : ""}${
      middleNameAr3 ? middleNameAr3 + " " : ""
    }${middleNameAr4 ? middleNameAr4 + " " : ""}${lastNameAr}`;

    // Gender
    result.gender = this.decodeBytesToText(585, 1) as "M" | "F";

    // Date of birth
    result.birthDate = processDateString(this.decodeBytesToText(586, 32));

    // Blood group
    result.bloodGroup = this.decodeBytesToText(594, 3) as bloodGroup;
  }
}
