import { GDNPR1 } from "../elementary-files-classes/GDNPR1";
import { GDNPR2 } from "../elementary-files-classes/GDNPR2";
import readEF from "../utils/readEF";

export default async function GDNPR(reader, protocol) {
  const gdnpr1 = new GDNPR1();
  await readEF(reader, protocol, gdnpr1);
  console.log(gdnpr1.result);
  const gdnpr2 = new GDNPR2();
  await readEF(reader, protocol, gdnpr2);
  console.log(gdnpr2.result);
}
