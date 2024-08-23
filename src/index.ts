import pcsc from "pcsclite";
import { CPR1 } from "./elementary-files/CPR1";
import transmit from "./utils/transmit";
import readBinaryData from "./utils/readBinaryData";
import readEF from "./utils/readEF";
import { CPR2 } from "./elementary-files/CPR2";
import { CPR3 } from "./elementary-files/CPR3";
import { CPR5 } from "./elementary-files/CPR5";
import { CPR6 } from "./elementary-files/CPR6";

const pcsclite = pcsc();

let globalReader: any = null;
let globalProtocol: any = null;

// V2.1
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
        async function (err, response) {
          if (err) {
            console.error("Error selecting CPR dedicated file:", err);
          } else {
            const cpr1 = new CPR1();
            await readEF(reader, protocol, cpr1);
            console.log(cpr1.result);
            const cpr2 = new CPR2();
            await readEF(reader, protocol, cpr2);
            console.log(cpr2.result);
            const cpr3 = new CPR3();
            await readEF(reader, protocol, cpr3);
            console.log(cpr3.result);
            const cpr5 = new CPR5();
            await readEF(reader, protocol, cpr5);
            console.log(cpr5.result);
            const cpr6 = new CPR6();
            await readEF(reader, protocol, cpr6);
            console.log(cpr6.result);
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
        console.log("card removed");
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
        console.log("card inserted");
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
