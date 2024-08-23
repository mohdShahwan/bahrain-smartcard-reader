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

// export function cpr1(reader, protocol): Promise<SmartcardData> {
//   return new Promise(function (resolve, reject) {
//     // Select first EF (CPR1)
//     const selectEf1 = Buffer.from("00A4020C020001", "hex");
//     const ef1Size = 2;
//     reader.transmit(
//       selectEf1,
//       ef1Size,
//       protocol,
//       async function (err, response) {
//         if (err) {
//           reject(`Error selecting first EF in CPR DF: ${err}`);
//         } else {
//           const cpr1AData = await cpr1A(reader, protocol);
//           const cpr1BData = await cpr1B(reader, protocol);
//           const cpr1CData = await cpr1C(reader, protocol);

//           const firstNameAr = (
//             cpr1AData.firstNameAr + cpr1BData.firstNameAr
//           ).trim();
//           const middleNameAr4 = (
//             cpr1BData.middleNameAr4 + cpr1CData.middleNameAr4
//           ).trim();
//           const { middleNameAr1, middleNameAr2, middleNameAr3 } = cpr1BData;
//           const { lastNameAr } = cpr1CData;

//           const fullNameAr = `${firstNameAr} ${
//             middleNameAr1 ? middleNameAr1 + " " : ""
//           }${middleNameAr2 ? middleNameAr2 + " " : ""}${
//             middleNameAr3 ? middleNameAr3 + " " : ""
//           }${middleNameAr4 ? middleNameAr4 + " " : ""}${lastNameAr}`;

//           const cpr1Data: SmartcardData = {
//             ...cpr1AData,
//             ...cpr1BData,
//             ...cpr1CData,
//             firstNameAr,
//             middleNameAr4,
//             fullNameAr,
//           };
//           resolve(cpr1Data);
//         }
//       }
//     );
//   });
// }

// function cpr1A(reader, protocol): Promise<SmartcardData> {
//   return new Promise(function (resolve, reject) {
//     const cpr1Data: SmartcardData = {};
//     // Select first record
//     const selectFirstRecord = Buffer.from("00B00000FF", "hex");
//     const firstRecordSize = 257;
//     reader.transmit(
//       selectFirstRecord,
//       firstRecordSize,
//       protocol,
//       function (err, response) {
//         if (err) {
//           reject(`Error selecting first record in first EF in CPR DF: ${err}`);
//         } else {
//           const data: string = response.toString("utf8").replace("�\x00", "");

//           cpr1Data.cprNumber =
//             data.substring(0, 9).trim().length === 8
//               ? "0" + data.substring(0, 9).trim()
//               : data.substring(0, 9).trim();
//           cpr1Data.firstNameEn = data.substring(9, 41).trim();
//           cpr1Data.middleNameEn1 = data.substring(41, 73).trim();
//           cpr1Data.middleNameEn2 = data.substring(73, 105).trim();
//           cpr1Data.middleNameEn3 = data.substring(105, 137).trim();
//           cpr1Data.middleNameEn4 = data.substring(137, 169).trim();
//           cpr1Data.lastNameEn = data.substring(169, 201).trim();
//           const {
//             firstNameEn,
//             middleNameEn1,
//             middleNameEn2,
//             middleNameEn3,
//             middleNameEn4,
//             lastNameEn,
//           } = cpr1Data;
//           cpr1Data.fullNameEn = `${firstNameEn} ${
//             middleNameEn1 ? middleNameEn1 + " " : ""
//           }${middleNameEn2 ? middleNameEn2 + " " : ""}${
//             middleNameEn3 ? middleNameEn3 + " " : ""
//           }${middleNameEn4 ? middleNameEn4 + " " : ""}${lastNameEn}`;
//           cpr1Data.firstNameAr = data.substring(201, data.length);
//           resolve(cpr1Data);
//         }
//       }
//     );
//   });
// }

// function cpr1B(reader, protocol): Promise<SmartcardData> {
//   return new Promise(function (resolve, reject) {
//     const cpr1Data: SmartcardData = {};
//     // Select second record
//     const selectSecondRecord = Buffer.from("00B000FFFF", "hex");
//     const secondRecordSize = 257;
//     reader.transmit(
//       selectSecondRecord,
//       secondRecordSize,
//       protocol,
//       function (err, response) {
//         if (err) {
//           reject(`Error selecting second record in first EF in CPR DF: ${err}`);
//         } else {
//           const data: string = response.toString("utf8").replace("�\x00", "");

//           cpr1Data.firstNameAr = data.substring(0, 10);
//           cpr1Data.middleNameAr1 = data.substring(10, 70).trim();
//           cpr1Data.middleNameAr2 = data.substring(70, 130).trim();
//           cpr1Data.middleNameAr3 = data.substring(130, 200).trim();
//           cpr1Data.middleNameAr4 = data.substring(200, data.length);
//           resolve(cpr1Data);
//         }
//       }
//     );
//   });
// }

// function cpr1C(reader, protocol): Promise<SmartcardData> {
//   return new Promise(function (resolve, reject) {
//     const cpr1Data: SmartcardData = {};
//     // Select third record
//     const selectThirdRecord = Buffer.from("00B001FE57", "hex");
//     const thirdRecordSize = 89;
//     reader.transmit(
//       selectThirdRecord,
//       thirdRecordSize,
//       protocol,
//       function (err, response) {
//         if (err) {
//           reject(`Error selecting third record in first EF in CPR DF: ${err}`);
//         } else {
//           const data: string = response.toString("utf8").replace("�\x00", "");

//           cpr1Data.middleNameAr4 = data.substring(0, 11);
//           cpr1Data.lastNameAr = data.substring(11, 70).trim();
//           cpr1Data.fullNameAr = "";
//           cpr1Data.gender = data[70] as "M" | "F";
//           const birthDateString = data.substring(71, 79);
//           cpr1Data.birthDate = processDateString(birthDateString);
//           cpr1Data.bloodGroup = data
//             .substring(79, data.length)
//             .trim() as bloodGroup;
//           resolve(cpr1Data);
//         }
//       }
//     );
//   });
// }
