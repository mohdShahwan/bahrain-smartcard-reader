function getBinarySelectParams(offset: number, length: number) {
  let offsetPos = offset;
  while (length > 0) {
    const lowAndHighBytes = getLowAndHighBytes(offsetPos);
    const P1: number = lowAndHighBytes[1];
    const P2: number = lowAndHighBytes[0];
    const Le: number = Math.min(length, 255);
    console.log(P1);
    console.log(P2);
    console.log(Le);
    const p1String =
      P1 < 10
        ? "0" + P1.toString(16).toUpperCase()
        : P1.toString(16).toUpperCase();
    const p2String =
      P2 < 10
        ? "0" + P2.toString(16).toUpperCase()
        : P2.toString(16).toUpperCase();
    const leString =
      Le < 10
        ? "0" + Le.toString(16).toUpperCase()
        : Le.toString(16).toUpperCase();
    console.log(`00B0${p1String}${p2String}${leString}`);
    console.log("##########");
    offsetPos += Le;
    length -= Le;
  }
}

function getLowAndHighBytes(offsetPos: number) {
  const bytes = new Uint8Array(new Uint32Array([offsetPos]).buffer);
  return [bytes[0], bytes[1]];
}

getBinarySelectParams(0, 597);
