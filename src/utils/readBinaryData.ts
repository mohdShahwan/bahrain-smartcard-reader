import transmit from "./transmit";

export default async function readBinaryData(reader, protocol, offset, length) {
  let destinationArray = new Uint8Array(length);
  let offsetPos = offset;

  while (length > 0) {
    let lowAndHighBytes = getLowAndHighBytes(offsetPos);
    const P1 = lowAndHighBytes[1];
    const P2 = lowAndHighBytes[0];
    const Le = Math.min(length, 255);

    const p1String =
      P1 < 16
        ? "0" + P1.toString(16).toUpperCase()
        : P1.toString(16).toUpperCase();
    const p2String =
      P2 < 16
        ? "0" + P2.toString(16).toUpperCase()
        : P2.toString(16).toUpperCase();
    const leString =
      Le < 16
        ? "0" + Le.toString(16).toUpperCase()
        : Le.toString(16).toUpperCase();
    const select = `00B0${p1String}${p2String}${leString}`;
    const response = await transmit(reader, protocol, select.toUpperCase(), Le);
    // Convert ArrayBuffer to Uint8Array
    const responseArray = new Uint8Array(response);
    // Copy the response data to the destination array
    destinationArray.set(responseArray.slice(0, Le), offsetPos - offset);

    offsetPos += Le;
    length -= Le;
  }

  return destinationArray;
}

function getLowAndHighBytes(offsetPos: number) {
  const bytes = new Uint8Array(new Uint32Array([offsetPos]).buffer);
  return [bytes[0], bytes[1]];
}
