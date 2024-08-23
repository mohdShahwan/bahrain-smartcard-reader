import pcsc from "pcsclite";
import { GDNPR1 } from "./elementary-files-classes/GDNPR1";
import readEF from "./utils/readEF";
import readDF from "./utils/readDF";
import CPR from "./dedicated-files-functions/CPR";
import GDNPR from "./dedicated-files-functions/GDNPR";
import GDT from "./dedicated-files-functions/GDT";

const pcsclite = pcsc();

let globalReader: any = null;
let globalProtocol: any = null;

// V2.1
function readSmartcard(reader, protocol) {
  // Select application
  const selectApp = Buffer.from("00A404000DD4990000010101000100000001", "hex");
  const appSize = 2;
  reader.transmit(selectApp, appSize, protocol, async function (err, response) {
    if (err) {
      console.error("Error selecting application:", err);
    } else {
      // Select CPR dedicated file
      const selectCprDf = "00A4000C020101";
      const cprDfSize = 2;
      await readDF(reader, protocol, selectCprDf, cprDfSize, CPR);
      // Select GDNPR dedicated file
      const selectGdnprDf = "00A4000C020301";
      const gdnprDfSize = 2;
      await readDF(reader, protocol, selectGdnprDf, gdnprDfSize, GDNPR);
      // Select GDT dedicated file
      const selectGdtDf = "00A4000C020201";
      const gdtDfSize = 2;
      await readDF(reader, protocol, selectGdtDf, gdtDfSize, GDT);
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
