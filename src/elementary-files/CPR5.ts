// import { SmartcardData } from "../types/smartcard-data";

// export function cpr2(reader, protocol): Promise<SmartcardData> {
//     return new Promise(function (resolve, reject) {
//       // Select second EF (CPR2)
//       const selectEf2 = Buffer.from("00A4020C020002", "hex");
//       const ef2Size = 2;
//       reader.transmit(
//         selectEf2,
//         ef2Size,
//         protocol,
//         async function (err, response) {
//           if (err) {
//             reject(`Error selecting second EF in CPR DF: ${err}`);
//           } else {
//             // const cpr2Data = await cpr2A(reader, protocol);
  
//             resolve(cpr2Data);
//           }
//         }
//       );
//     });
//   }