import { GDNPR1 } from "../elementary-files/GDNPR1";
import readEF from "../utils/readEF";

export default async function GDNPR(reader, protocol) {
  const gdnpr1 = new GDNPR1();
  await readEF(reader, protocol, gdnpr1);
  console.log(gdnpr1.result);
}
