import EF from "../elementary-files-classes/EF";
import readBinaryData from "./readBinaryData";

export default function readEF(
  reader,
  protocol,
  ef: EF<any>
): Promise<ArrayBuffer> {
  const efSelectBuffer = Buffer.from(ef.selectCommand, "hex");
  return new Promise(function (resolve, reject) {
    reader.transmit(
      efSelectBuffer,
      ef.size,
      protocol,
      async function (err, response) {
        if (err) {
          reject(`Error selecting CPR1 EF: ${err}`);
        } else {
          ef.buffer = await readBinaryData(reader, protocol, 0, ef.size);
          ef.populateResult();
          ef.assembleData();
          resolve(response);
        }
      }
    );
  });
}
