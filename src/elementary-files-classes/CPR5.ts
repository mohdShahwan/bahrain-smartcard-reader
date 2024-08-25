import { ICPR5 } from "../types";
import EF from "./EF";
import governorates from "../../data/governorates.json";

/*
  This EF contains:
  - Email
  - Contact Number
  - Residence Number
  - Flat Number
  - Building Number
  - Building Alpha in English and Arabic
  - Road Number
  - Road Name in English and Arabic
  - Block Number
  - Block Name in English and Arabic
  - Governorate Number
*/

export class CPR5 extends EF<ICPR5> {
  constructor() {
    super();
    this.size = 512;
    this.selectCommand = "00A4020C020005";
    this.buffer = new Uint8Array(this.size);
    this.result = { address: {} };
  }

  populateResult() {
    const result = this.result;

    result.email = this.decodeBytesToText(0, 64);
    result.contactNumber = this.decodeBytesToText(64, 12);

    const address = result.address;
    address.residenceNumber = this.decodeBytesToText(76, 12);
    address.flatNumber = this.decodeBytesToText(105, 4);
    address.buildingNumber = this.decodeBytesToText(109, 4);
    address.buildingAlphaEn = this.decodeBytesToText(113, 1);
    address.buildingAlphaAr = this.decodeBytesToText(114, 2);
    address.roadNumber = this.decodeBytesToText(116, 4);
    address.roadNameEn = this.decodeBytesToText(120, 64);
    address.roadNameAr = this.decodeBytesToText(184, 128);
    address.blockNumber = this.decodeBytesToText(312, 4);
    address.blockNameEn = this.decodeBytesToText(316, 64);
    address.blockNameAr = this.decodeBytesToText(380, 128);
    address.governorateNumber = this.decodeBytesToText(508, 4);
    const {
      flatNumber,
      buildingNumber,
      buildingAlphaEn,
      roadNumber,
      roadNameEn,
      roadNameAr,
      blockNumber,
      blockNameEn,
      blockNameAr,
      governorateNumber,
    } = address;
    if (blockNumber) {
      const governorate = governorates.GovernorateList.Governorates.find(
        (governorate) =>
          governorate.Governorate.some(
            (block) => block._BlockID === blockNumber
          )
      );
      address.governorateNameEn = governorate
        ? governorate._GovernorateNameEnglish
        : "";
      address.governorateNameAr = governorate
        ? governorate._GovernorateNameArabic
        : "";
    }
    // Full address
    let fullAddress = "";
    fullAddress += flatNumber ? `Flat/Villa ${flatNumber}` : "";
    fullAddress += buildingNumber ? ` Bldg #:${buildingNumber}` : "";
    fullAddress += buildingAlphaEn ? ` Bldg Alpha:${buildingAlphaEn}` : "";
    fullAddress += roadNumber ? ` Road:${roadNumber}` : "";
    fullAddress += roadNameEn ? ` Rd Name:${roadNameEn}/${roadNameAr}` : "";
    fullAddress += blockNumber ? ` Block #:${blockNumber}` : "";
    fullAddress += blockNameEn ? ` Block:${blockNameEn}/${blockNameAr}` : "";
    fullAddress += governorateNumber ? ` Gov #: ${governorateNumber}` : "";
    result.fullAddress = fullAddress;
  }
}
