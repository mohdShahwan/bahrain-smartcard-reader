function getBinarySelectParams(offset, length) {
  let offsetPos = offset;
  while (length > 0) {
    const lowAndHighBytes = getLowAndHighBytes(offsetPos);
    const P1 = lowAndHighBytes[1];
    const P2 = lowAndHighBytes[0];
    const Le = Math.min(length, 255);
    console.log(P1);
    console.log(P2);
    console.log(Le);
    console.log("##########");
    offsetPos += Le;
    length -= Le;
  }
}

function getLowAndHighBytes(offsetPos) {
  const bytes = new Uint8Array(new Uint32Array([offsetPos]).buffer);
  return [bytes[0], bytes[1]];
}

getBinarySelectParams(0, 597);
