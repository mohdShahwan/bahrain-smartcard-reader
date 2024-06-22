import pcsc from "pcsclite";
import { cpr1A, cpr1B, cpr1C } from "./helpers/CPR1";
import { SmartcardData } from "./types/smartcard-data";

const pcsclite = pcsc();

let globalReader: any = null;
let globalProtocol: any = null;

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
              async function (err, response) {
                if (err) {
                  console.error("Error selecting first EF in CPR DF:", err);
                } else {
                  const cpr1AData = await cpr1A(reader, protocol);
                  const cpr1BData = await cpr1B(reader, protocol);
                  const cpr1CData = await cpr1C(reader, protocol);

                  const firstNameAr = (
                    cpr1AData.firstNameAr + cpr1BData.firstNameAr
                  ).trim();
                  const middleNameAr4 = (
                    cpr1BData.middleNameAr4 + cpr1CData.middleNameAr4
                  ).trim();
                  const { middleNameAr1, middleNameAr2, middleNameAr3 } =
                    cpr1BData;
                  const { lastNameAr } = cpr1CData;

                  const fullNameAr = `${firstNameAr} ${
                    middleNameAr1 ? middleNameAr1 + " " : ""
                  }${middleNameAr2 ? middleNameAr2 + " " : ""}${
                    middleNameAr3 ? middleNameAr3 + " " : ""
                  }${middleNameAr4 ? middleNameAr4 + " " : ""}${lastNameAr}`;

                  const cpr1Data: SmartcardData = {
                    ...cpr1AData,
                    ...cpr1BData,
                    ...cpr1CData,
                    firstNameAr,
                    middleNameAr4,
                    fullNameAr,
                  };
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
