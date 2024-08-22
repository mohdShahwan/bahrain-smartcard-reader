export default function transmit(
  reader,
  protocol,
  select: string,
  size: number
): Promise<ArrayBuffer> {
  return new Promise(function (resolve, reject) {
    const selectBuffer = Buffer.from(select, "hex");
    reader.transmit(
      selectBuffer,
      size + 2,
      protocol,
      async function (err, response) {
        if (err) reject(`Error selecting EF: ${err}`);
        else resolve(response);
      }
    );
  });
}
