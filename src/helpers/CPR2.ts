import { SmartcardData } from "../types/smartcard-data";
import processDateString from "./processDateString";

export function cpr2(reader, protocol): Promise<SmartcardData> {
  return new Promise(function (resolve, reject) {
    // Select second EF (CPR2)
    const selectEf2 = Buffer.from("00A4020C020002", "hex");
    const ef2Size = 2;
    reader.transmit(
      selectEf2,
      ef2Size,
      protocol,
      async function (err, response) {
        if (err) {
          reject(`Error selecting second EF in CPR DF: ${err}`);
        } else {
          const cpr2Data = await cpr2A(reader, protocol);

          resolve(cpr2Data);
        }
      }
    );
  });
}

function cpr2A(reader, protocol): Promise<SmartcardData> {
  return new Promise(function (resolve, reject) {
    const cpr2Data: SmartcardData = {};
    // Select first record
    const selectFirstRecord = Buffer.from("00B0000024", "hex");
    const firstRecordSize = 38;
    reader.transmit(
      selectFirstRecord,
      firstRecordSize,
      protocol,
      function (err, response) {
        if (err) {
          reject(`Error selecting first record in second EF in CPR DF: ${err}`);
        } else {
          const data: string = response.toString("utf8").replace("�\x00", "");

          cpr2Data.cardExpiryDate = processDateString(data.substring(0, 8));
          cpr2Data.cardIssueDate = processDateString(data.substring(8, 16));
          cpr2Data.issuingAuthority = data.substring(16, 36).trim();
          resolve(cpr2Data);
        }
      }
    );
  });
}
