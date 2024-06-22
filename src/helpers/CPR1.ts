import { SmartcardData } from "../types/smartcard-data";
import processDateString from "./processDateString";

export function cpr1A(reader, protocol): Promise<SmartcardData> {
  return new Promise(function (resolve, reject) {
    const cpr1Data: SmartcardData = {};
    // Select first record
    const selectFirstRecord = Buffer.from("00B00000FF", "hex");
    const firstRecordSize = 257;
    reader.transmit(
      selectFirstRecord,
      firstRecordSize,
      protocol,
      function (err, response) {
        if (err) {
          reject(`Error selecting first record in first EF in CPR DF: ${err}`);
        } else {
          const data: string = response.toString("utf8").replace("�\x00", "");

          cpr1Data.cprNumber =
            data.substring(0, 9).trim().length === 8
              ? "0" + data.substring(0, 9).trim()
              : data.substring(0, 9).trim();
          cpr1Data.firstNameEn = data.substring(9, 41).trim();
          cpr1Data.middleNameEn1 = data.substring(41, 73).trim();
          cpr1Data.middleNameEn2 = data.substring(73, 105).trim();
          cpr1Data.middleNameEn3 = data.substring(105, 137).trim();
          cpr1Data.middleNameEn4 = data.substring(137, 169).trim();
          cpr1Data.lastNameEn = data.substring(169, 201).trim();
          const {
            firstNameEn,
            middleNameEn1,
            middleNameEn2,
            middleNameEn3,
            middleNameEn4,
            lastNameEn,
          } = cpr1Data;
          cpr1Data.fullNameEn = `${firstNameEn} ${
            middleNameEn1 ? middleNameEn1 + " " : ""
          }${middleNameEn2 ? middleNameEn2 + " " : ""}${
            middleNameEn3 ? middleNameEn3 + " " : ""
          }${middleNameEn4 ? middleNameEn4 + " " : ""}${lastNameEn}`;
          cpr1Data.firstNameAr = data.substring(201, data.length);
          resolve(cpr1Data);
        }
      }
    );
  });
}

export function cpr1B(reader, protocol): Promise<SmartcardData> {
  return new Promise(function (resolve, reject) {
    const cpr1Data: SmartcardData = {};
    // Select second record
    const selectSecondRecord = Buffer.from("00B000FFFF", "hex");
    const secondRecordSize = 257;
    reader.transmit(
      selectSecondRecord,
      secondRecordSize,
      protocol,
      function (err, response) {
        if (err) {
          reject(`Error selecting second record in first EF in CPR DF: ${err}`);
        } else {
          const data: string = response.toString("utf8").replace("�\x00", "");

          cpr1Data.firstNameAr = data.substring(0, 10);
          cpr1Data.middleNameAr1 = data.substring(10, 70).trim();
          cpr1Data.middleNameAr2 = data.substring(70, 130).trim();
          cpr1Data.middleNameAr3 = data.substring(130, 200).trim();
          cpr1Data.middleNameAr4 = data.substring(200, data.length);
          resolve(cpr1Data);
        }
      }
    );
  });
}

type bloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export function cpr1C(reader, protocol): Promise<SmartcardData> {
  return new Promise(function (resolve, reject) {
    const cpr1Data: SmartcardData = {};
    // Select third record
    const selectThirdRecord = Buffer.from("00B001FE57", "hex");
    const thirdRecordSize = 89;
    reader.transmit(
      selectThirdRecord,
      thirdRecordSize,
      protocol,
      function (err, response) {
        if (err) {
          reject(`Error selecting third record in first EF in CPR DF: ${err}`);
        } else {
          const data: string = response.toString("utf8").replace("�\x00", "");

          cpr1Data.middleNameAr4 = data.substring(0, 11);
          cpr1Data.lastNameAr = data.substring(11, 70).trim();
          cpr1Data.fullNameAr = "";
          cpr1Data.gender = data[70] as "M" | "F";
          const birthDateString = data.substring(71, 79);
          cpr1Data.birthDate = processDateString(birthDateString);
          cpr1Data.bloodGroup = data
            .substring(79, data.length)
            .trim() as bloodGroup;
          resolve(cpr1Data);
        }
      }
    );
  });
}