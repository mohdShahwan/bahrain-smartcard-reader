import pcsc from "pcsclite";
import { SmartcardData } from "./types/smartcard-data";
import processDateString from "./helpers/processDateString";

const pcsclite = pcsc();

let globalReader: any = null;
let globalProtocol: any = null;

type bloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

// V2
function readSmartcard(reader, protocol) {
  // Select application
  const selectApp = Buffer.from("00A404000DD4990000010101000100000001", "hex");
  const appSize = 2;
  reader.transmit(selectApp, appSize, protocol, function (err, response) {
    if (err) {
      console.error("Error selecting application:", err);
    } else {
      // Select CPR dedicated file
      const selectCprDf = Buffer.from("00A4000C020101", "hex");
      const cprDfSize = 2;
      reader.transmit(
        selectCprDf,
        cprDfSize,
        protocol,
        function (err, response) {
          if (err) {
            console.error("Error selecting CPR dedicated file:", err);
          } else {
            // In this dedicated file, we have 6 elementary files

            // Select first EF (CPR1)
            const selectEf1 = Buffer.from("00A4020C020001", "hex");
            const ef1Size = 2;
            reader.transmit(
              selectEf1,
              ef1Size,
              protocol,
              function (err, response) {
                if (err) {
                  console.error("Error selecting first EF in CPR DF:", err);
                } else {
                  let cpr1Data: SmartcardData = {};
                  // Select first record
                  const selectFirstRecord = Buffer.from("00B00000FF", "hex");
                  const firstRecordSize = 257;
                  reader.transmit(
                    selectFirstRecord,
                    firstRecordSize,
                    protocol,
                    function (err, response) {
                      if (err) {
                        console.error(
                          "Error selecting first record in first EF in CPR DF:",
                          err
                        );
                      } else {
                        const data: string = response
                          .toString("utf8")
                          .replace("�\x00", "");

                        cpr1Data.cprNumber =
                          data.substring(0, 9).trim().length === 8
                            ? "0" + data.substring(0, 9).trim()
                            : data.substring(0, 9).trim();
                        cpr1Data.firstNameEn = data.substring(9, 41).trim();
                        cpr1Data.middleNameEn1 = data.substring(41, 73).trim();
                        cpr1Data.middleNameEn2 = data.substring(73, 105).trim();
                        cpr1Data.middleNameEn3 = data
                          .substring(105, 137)
                          .trim();
                        cpr1Data.middleNameEn4 = data
                          .substring(137, 169)
                          .trim();
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
                        }${
                          middleNameEn4 ? middleNameEn4 + " " : ""
                        }${lastNameEn}`;
                        cpr1Data.firstNameAr = data.substring(201, data.length);
                      }
                    }
                  );

                  // Select second record
                  const selectSecondRecord = Buffer.from("00B000FFFF", "hex");
                  const secondRecordSize = 257;
                  reader.transmit(
                    selectSecondRecord,
                    secondRecordSize,
                    protocol,
                    function (err, response) {
                      let lock: boolean = true;
                      while (lock) if ("firstNameAr" in cpr1Data) lock = false;

                      const data: string = response
                        .toString("utf8")
                        .replace("�\x00", "");
                      cpr1Data.firstNameAr = (
                        cpr1Data.firstNameAr + data.substring(0, 10)
                      ).trim();
                      cpr1Data.middleNameAr1 = data.substring(10, 70).trim();
                      cpr1Data.middleNameAr2 = data.substring(70, 130).trim();
                      cpr1Data.middleNameAr3 = data.substring(130, 200).trim();
                      cpr1Data.middleNameAr4 = data.substring(200, data.length);
                    }
                  );

                  // Select third record
                  const selectThirdRecord = Buffer.from("00B001FE57", "hex");
                  const thirdRecordSize = 89;
                  reader.transmit(
                    selectThirdRecord,
                    thirdRecordSize,
                    protocol,
                    function (err, response) {
                      let lock: boolean = true;
                      while (lock)
                        if ("middleNameAr4" in cpr1Data) lock = false;

                      const data: string = response
                        .toString("utf8")
                        .replace("�\x00", "");

                      cpr1Data.middleNameAr4 = (
                        cpr1Data.middleNameAr4 + data.substring(0, 11)
                      ).trim();
                      cpr1Data.lastNameAr = data.substring(11, 70).trim();
                      const {
                        firstNameAr,
                        middleNameAr1,
                        middleNameAr2,
                        middleNameAr3,
                        middleNameAr4,
                        lastNameAr,
                      } = cpr1Data;

                      cpr1Data.fullNameAr = `${firstNameAr} ${
                        middleNameAr1 ? middleNameAr1 + " " : ""
                      }${middleNameAr2 ? middleNameAr2 + " " : ""}${
                        middleNameAr3 ? middleNameAr3 + " " : ""
                      }${
                        middleNameAr4 ? middleNameAr4 + " " : ""
                      }${lastNameAr}`;
                      cpr1Data.gender = data[70] as "M" | "F";
                      const birthDateString = data.substring(71, 79);
                      cpr1Data.birthDate = processDateString(birthDateString);
                      cpr1Data.bloodGroup = data
                        .substring(79, data.length)
                        .trim() as bloodGroup;
                    }
                  );

                  // Testing
                  setTimeout(function () {
                    console.log(cpr1Data);
                  }, 300);
                }
              }
            );
          }
        }
      );
    }
  });
}

function triggerFunction() {
  if (globalReader && globalProtocol) {
    console.log("Trigger condition met. Calling function...");
    return readSmartcard(globalReader, globalProtocol);
  } else {
    console.log("Reader or protocol not available yet.");
    return null;
  }
}

pcsclite.on("reader", function (reader) {
  console.log("New reader detected", reader.name);

  reader.on("error", function (err) {
    console.log("Error(", this.name, "):", err.message);
  });

  reader.on("status", function (status) {
    console.log("Status(", this.name, "):", status);
    /* check what has changed */
    var changes = this.state ^ status.state;
    if (changes) {
      if (
        changes & this.SCARD_STATE_EMPTY &&
        status.state & this.SCARD_STATE_EMPTY
      ) {
        console.log("card removed"); /* card removed */
        reader.disconnect(reader.SCARD_LEAVE_CARD, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Disconnected");
            globalReader = null;
            globalProtocol = null;
          }
        });
      } else if (
        changes & this.SCARD_STATE_PRESENT &&
        status.state & this.SCARD_STATE_PRESENT
      ) {
        console.log("card inserted"); /* card inserted */
        reader.connect(
          { share_mode: this.SCARD_SHARE_SHARED },
          function (err, protocol) {
            if (err) {
              console.log(err);
            } else {
              console.log("Protocol(", reader.name, "):", protocol);
              globalReader = reader;
              globalProtocol = protocol;
              triggerFunction();
            }
          }
        );
      }
    }
  });

  reader.on("end", function () {
    console.log("Reader", this.name, "removed");
  });
});

pcsclite.on("error", function (err) {
  console.log("PCSC error", err.message);
});
