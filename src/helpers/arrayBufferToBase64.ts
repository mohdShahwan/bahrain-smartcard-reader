/*
  This EF contains:
  - Photo
  - Signature
*/
export function arrayBufferToBase64(buffer: Buffer | Uint8Array): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
