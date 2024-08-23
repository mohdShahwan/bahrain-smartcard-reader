import { IGDNPR1 } from "../types/smartcard-data";
import EF from "./EF";
import countries from "../../data/countries.json";

/*
  This EF contains:
  - Nationality code
  - Birth country
*/

export class GDNPR1 extends EF<IGDNPR1> {
  constructor() {
    super();
    this.size = 6;
    this.selectCommand = "00A4020C020001";
    this.buffer = new Uint8Array(this.size);
    this.result = { nationality: {}, birthCountry: {} };
  }

  populateResult() {
    const result = this.result;

    const nationality = this.decodeBytesToText(0, 3);
    const birthCountry = this.decodeBytesToText(3, 3);

    if (nationality) {
      const nationalityCountry = countries.Countries.find(
        (c) => c._BAH_COUNTRY_CODE === nationality
      );
      console.log(nationalityCountry);
      result.nationality.isoCode = nationalityCountry._ISO3166_CODE;
      result.nationality.alpha2Code = nationalityCountry._ALPHA2_CODE;
      result.nationality.alpha3Code = nationalityCountry._ALPHA3_CODE;
      result.nationality.nationalityNameEn =
        nationalityCountry._NATIONALITY_ENGLISH_NAME;
      result.nationality.nationalityNameAr =
        EF.smartcardData.gender === "M"
          ? nationalityCountry._NATIONALITY_ARABIC_NAME_MALE
          : nationalityCountry._NATIONALITY_ARABIC_NAME_FEMALE;
    }

    if (birthCountry) {
      const foundBirthCountry = countries.Countries.find(
        (c) => c._BAH_COUNTRY_CODE === birthCountry
      );
      result.birthCountry.isoCode = foundBirthCountry._ISO3166_CODE;
      result.birthCountry.alpha2Code = foundBirthCountry._ALPHA2_CODE;
      result.birthCountry.alpha3Code = foundBirthCountry._ALPHA3_CODE;
    }
  }
}
