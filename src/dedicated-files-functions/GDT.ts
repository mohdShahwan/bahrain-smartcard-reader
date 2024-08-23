import { GDT2 } from "../elementary-files-classes/GDT2";
import readEF from "../utils/readEF";

export default async function GDT(reader, protocol) {
  const gdt2 = new GDT2();
  await readEF(reader, protocol, gdt2);
  // console.log(gdt2.result);
}
