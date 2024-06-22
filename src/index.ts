import pcsc from "pcsclite";
import { SmartcardData } from "./types/smartcard-data";

const pcsclite = pcsc();

let globalReader: any = null;
let globalProtocol: any = null;

async function readSmartcard1(reader, protocol) {
  let smartcardData: any = {};
  // Select DF by name
  const selectApduCommand = Buffer.from([
    0x00, 0xa4, 0x04, 0x00, 0x0d, 0xd4, 0x99, 0x00, 0x00, 0x01, 0x01, 0x01,
    0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  ]);
  await reader.transmit(selectApduCommand, 255, protocol, function (err, data) {
    if (err) {
      console.error("Error selecting application:", err);
    } else {
      console.log("Application selection response:", data.toString("hex"));
      // Select DF file
      const selectDfCommand = Buffer.from([
        0x00, 0xa4, 0x00, 0x0c, 0x02, 0x01, 0x01,
      ]);
      reader.transmit(selectDfCommand, 255, protocol, (err, response) => {
        if (err) {
          console.error("Error selecting DF:", err);
        } else {
          // Select first data file
          const selectDfCommand = Buffer.from([
            0x00, 0xa4, 0x02, 0x0c, 0x02, 0x00, 0x01,
          ]);
          reader.transmit(selectDfCommand, 255, protocol, (err, response) => {
            if (err) {
              console.error("Error selecting first data file:", err);
            } else {
              // Read first record binary data
              // Second record contains cprNumber, firstNameEn, middleName1En,
              // middleName2En, middleName3En, middleName4En
              // lastNameEn and firstNameAr
              const readBinaryCommand = Buffer.from([
                0x00, 0xb0, 0x00, 0x00, 0xff,
              ]);
              reader.transmit(
                readBinaryCommand,
                512,
                protocol,
                (err, response) => {
                  if (err) {
                    console.error("Error reading first binary data:", err);
                  } else {
                    const data = response.toString("utf8");
                    smartcardData = {
                      cprNumber:
                        data.substring(0, 9).trim().length === 8
                          ? "0" + data.substring(0, 9).trim()
                          : data.substring(0, 9).trim(),
                      firstNameEn: data.substring(9, 41).trim(),
                      middleName1En: data.substring(41, 73).trim(),
                      middleName2En: data.substring(73, 105).trim(),
                      middleName3En: data.substring(105, 137).trim(),
                      middleName4En: data.substring(137, 169).trim(),
                      lastNameEn: data.substring(169, 201).trim(),
                      firstNameAr: data.substring(201, data.length - 2).trim(),
                    };
                  }
                }
              );
              // Read second record binary data
              // Second record contains middleName1Ar, middleName2Ar,
              // middleName3Ar, middleName4Ar and lastNameAr
              const readBinaryCommand2 = Buffer.from([
                0x00, 0xb0, 0x01, 0x00, 0xff,
              ]);
              reader.transmit(
                readBinaryCommand2,
                512,
                protocol,
                (err, response) => {
                  if (err) {
                    console.error("Error reading second binary data:", err);
                  } else {
                    data = response.toString("utf-8");
                    const firstNameAr = (
                      smartcardData.firstNameAr + data.substring(0, 9)
                    ).trim();
                    const middleName1Ar = data.substring(9, 68).trim();
                    const middleName2Ar = data.substring(68, 104).trim();
                    const middleName3Ar = data.substring(105, 137).trim();
                    const middleName4Ar = data.substring(137, 169).trim();
                    const lastNameAr = data.substring(169, 201).trim();
                    const unknown = data.substring(201, data.length - 1).trim();
                    smartcardData = {
                      ...smartcardData,
                      firstNameAr,
                      middleName1Ar,
                      middleName2Ar,
                      middleName3Ar,
                      middleName4Ar,
                      lastNameAr,
                      unknown,
                    };
                    console.log(smartcardData);
                  }
                }
              );
            }
          });
        }
      });
      // Select Second DF
      const selectDfCommand2 = Buffer.from([
        0x00, 0xa4, 0x00, 0x0c, 0x02, 0x00, 0x02,
      ]);
      reader.transmit(selectDfCommand2, 255, protocol, (err, response) => {
        if (err) {
          console.error("Error selecting second DF:", err);
        } else {
        }
      });
    }
  });
  return smartcardData;
}

// V1
function readSmartcardV1(reader, protocol) {
  // Select CPR Dedicated File
  const selectCprDf = Buffer.from("00A404000BF000000078010001435052", "hex");
  const cprDfSize = 11299;
  reader.transmit(selectCprDf, cprDfSize, protocol, function (err, response) {
    if (err) {
      console.error("Error selecting CPR DF:", err);
    } else {
      // Select CPR First Elementary File
      const selectCprEf1 = Buffer.from("80A40804020001", "hex");
      const cprEf1Size = 610;
      reader.transmit(
        selectCprEf1,
        cprEf1Size,
        protocol,
        function (err, response) {
          if (err) {
            console.error("Error selecting CPR first elementary file:", err);
          } else {
            /*
            First elementary file will contain:
            - Full name in arabic: 6 names * 64 byte each
            - Blood group: 3 bytes
            - CPR number: 9 bytes
            - Date of birth: 8 bytes
            - Full name in english: 6 names * 32 byte each
            - Gender: 1 byte
            - CPR expiry date: 8 bytes
          */
            const data = response.toString("utf8");
            console.log(data);
          }
        }
      );
    }
  });
}

// V2
function readSmartcard(reader, protocol) {
  // Select application
  const selectApp = Buffer.from("00A404000DD4990000010101000100000001", "hex");
  const appSize = 11100;
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

            // Select first EF
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
                        const data = response.toString("utf8");
                        console.log(data);
                      }
                    }
                  );
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
