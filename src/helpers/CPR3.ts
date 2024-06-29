import { SmartcardData } from "../types/smartcard-data";

/*
  This EF contains:
  - Photo
  - Signature
*/

function arrayBufferToBase64(buffer: Buffer | Uint8Array): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function cpr3(reader, protocol): Promise<SmartcardData> {
  return new Promise(function (resolve, reject) {
    // Select third EF (CPR3)
    const selectEf3 = Buffer.from("00A4020C020003", "hex");
    const ef3Size = 2;
    reader.transmit(
      selectEf3,
      ef3Size,
      protocol,
      async function (err, response) {
        if (err) {
          reject(`Error selecting third EF in CPR DF: ${err}`);
        } else {
          const photoBinarySelectCommands = [
            "00B00000FF",
            "00B000FFFF",
            "00B001FEFF",
            "00B002FDFF",
            "00B003FCFF",
            "00B004FBFF",
            "00B005FAFF",
            "00B006F9FF",
            "00B007F8FF",
            "00B008F7FF",
            "00B009F6FF",
            "00B00AF5FF",
            "00B00BF4FF",
            "00B00CF3FF",
            "00B00DF2FF",
          ];
          const photoBuffer = new Uint8Array(4000);
          let offset = 0;
          for (const selectCommand of photoBinarySelectCommands) {
            const buffer = await cpr3Image(reader, protocol, selectCommand);
            photoBuffer.set(buffer, offset);
            offset += buffer.length;
          }
          const buffer = (
            await cpr3Image(reader, protocol, "00B00EF1FF")
          ).subarray(0, 175);
          photoBuffer.set(buffer, offset);

          const photo = arrayBufferToBase64(photoBuffer);

          const signatureBinarySelectCommands = [
            "00B00FF0FF",
            "00B010EFFF",
            "00B011EEFF",
            "00B012EDFF",
            "00B013ECFF",
            "00B014EBFF",
            "00B015EAFF",
            "00B016E987",
          ];
          const signatureBuffer = new Uint8Array(2000);
          offset = 0;
          const buffer1 = (
            await cpr3Image(reader, protocol, "00B00EF1FF")
          ).subarray(175, 255);
          signatureBuffer.set(buffer1, offset);
          offset += buffer1.length;
          for (const selectCommand of signatureBinarySelectCommands) {
            const buffer = await cpr3Image(reader, protocol, selectCommand);
            signatureBuffer.set(buffer, offset);
            offset += buffer.length;
          }

          const signature = arrayBufferToBase64(signatureBuffer);

          const cpr3Data: SmartcardData = {
            photo,
            signature,
          }
          
          resolve(cpr3Data);
        }
      }
    );
  });
}

function cpr3Image(reader, protocol, selectCommand: string): Promise<Buffer> {
  return new Promise(function (resolve, reject) {
    const select = Buffer.from(selectCommand, "hex");
    const size = 257;
    reader.transmit(select, size, protocol, function (err, response: Buffer) {
      if (err) {
        reject(`Error selecting a record in third EF in CPR DF: ${err}`);
      } else {
        resolve(response.subarray(0, response.length - 2));
      }
    });
  });
}
