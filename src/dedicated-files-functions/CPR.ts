import { CPR1 } from "../elementary-files-classes/CPR1";
import { CPR2 } from "../elementary-files-classes/CPR2";
import { CPR3 } from "../elementary-files-classes/CPR3";
import { CPR5 } from "../elementary-files-classes/CPR5";
import { CPR6 } from "../elementary-files-classes/CPR6";
import readEF from "../utils/readEF";

export default async function CPR(reader, protocol) {
  const cpr1 = new CPR1();
  await readEF(reader, protocol, cpr1);
  // console.log(cpr1.result);
  const cpr2 = new CPR2();
  await readEF(reader, protocol, cpr2);
  // console.log(cpr2.result);
  const cpr3 = new CPR3();
  await readEF(reader, protocol, cpr3);
  // console.log(cpr3.result);
  const cpr5 = new CPR5();
  await readEF(reader, protocol, cpr5);
  // console.log(cpr5.result);
  const cpr6 = new CPR6();
  await readEF(reader, protocol, cpr6);
  // console.log(cpr6.result);
}
