export default async function readDF(
  reader,
  protocol,
  select: string,
  size: number,
  callback
) {
  return new Promise(async function (resolve, reject) {
    const selectBuffer = Buffer.from(select, "hex");
    reader.transmit(
      selectBuffer,
      size,
      protocol,
      async function (err, response) {
        if (err) {
          reject("Error selecting dedicated file:" + err);
        } else {
          await callback(reader, protocol);
          resolve("DONE");
        }
      }
    );
  });
}
