import pcsc from "pcsclite";
import CPR from "./dedicated-files-functions/CPR";
import GDNPR from "./dedicated-files-functions/GDNPR";
import GDT from "./dedicated-files-functions/GDT";
import readDF from "./utils/readDF";
import { CardTypes, SmartcardData } from "./types";
import getInsertedCardType from "./utils/getInsertedCardType";
import EF from "./elementary-files-classes/EF";

const pcsclite = pcsc();

let globalReader: any = null;
let globalProtocol: any = null;
let globalAtr: string = null;

// V4
function fetchSmartcardData(reader, protocol): Promise<SmartcardData> {
  return new Promise(function (resolve, reject) {
    // Select application
    const selectApp = Buffer.from(
      "00A404000DD4990000010101000100000001",
      "hex"
    );
    const appSize = 2;
    reader.transmit(
      selectApp,
      appSize,
      protocol,
      async function (err, response) {
        if (err) {
          reject("Error selecting application:" + err);
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
          resolve(EF.smartcardData);
        }
      }
    );
  });
}

export async function readSmartcard() {
  if (globalReader && globalProtocol && globalAtr) {
    console.log("Trigger condition met. Calling function...");
    const cardType: CardTypes = getInsertedCardType(globalAtr);
    if (cardType === CardTypes.v1) console.log("Card type V1");
    else if (cardType === CardTypes.v2) console.log("Card type V2");
    else if (cardType === CardTypes.v4) console.log("Card type V4");
    else console.log("Unknown card type");
    const smartcardData = await fetchSmartcardData(
      globalReader,
      globalProtocol
    );
    return smartcardData;
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
          async function (err, protocol) {
            if (err) {
              console.log(err);
            } else {
              const atr = status.atr.toString("hex").toUpperCase();
              console.log("ATR:", atr);
              console.log("Protocol(", reader.name, "):", protocol);
              globalReader = reader;
              globalProtocol = protocol;
              globalAtr = atr;
              //   console.log(await triggerFunction());
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
