export enum CardTypes {
  v1,
  v2,
  v4,
  unknown,
}

export interface SmartcardData
  extends ICPR1,
    ICPR2,
    ICPR3,
    ICPR5,
    ICPR6,
    IGDNPR1,
    IGDNPR2,
    IGDNPR3,
    IGDT2 {}

export interface ICPR1 {
  cprNumber?: string;
  firstNameEn?: string;
  middleNameEn1?: string;
  middleNameEn2?: string;
  middleNameEn3?: string;
  middleNameEn4?: string;
  lastNameEn?: string;
  fullNameEn?: string;
  firstNameAr?: string;
  middleNameAr1?: string;
  middleNameAr2?: string;
  middleNameAr3?: string;
  middleNameAr4?: string;
  lastNameAr?: string;
  fullNameAr?: string;
  gender?: "M" | "F";
  birthDate?: Date;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
}

export interface ICPR2 {
  cardExpiryDate?: Date;
  cardIssueDate?: Date;
  issuingAuthority?: string;
}

export interface ICPR3 {
  photo?: string;
  signature?: string;
}

export interface ICPR5 {
  email?: string;
  contactNumber?: string;
  address: {
    residenceNumber?: string;
    flatNumber?: string;
    buildingNumber?: string;
    buildingAlphaEn?: string;
    buildingAlphaAr?: string;
    roadNumber?: string;
    roadNameEn?: string;
    roadNameAr?: string;
    blockNumber?: string;
    blockNameEn?: string;
    blockNameAr?: string;
    governorateNumber?: string;
    governorateNameEn?: string;
    governorateNameAr?: string;
  };
  fullAddress?: string;
}

export interface ICPR6 {
  occupationDescriptionEn?: string;
  occupationDescriptionAr?: string;
  employerNumber?: string;
  employerNameEn?: string;
  employerNameAr?: string;
  employerFlag?: string;
  employmentFlag?: string;
  sponsorCPRNumberOrUnitNumber?: string;
  sponsorNameEn?: string;
  sponsorNameAr?: string;
  sponsorFlag?: string;
  laborForceParticipation?: string;
  latestEducationDegreeEn?: string;
  latestEducationDegreeAr?: string;
  clearingAgentIndicator?: string;
}

export interface IGDNPR1 {
  nationality?: Country & {
    nationalityNameEn?: string;
    nationalityNameAr?: string;
  };
  birthCountry?: Country;
}

interface Country {
  isoCode?: string;
  alpha2Code?: string;
  alpha3Code?: string;
}

export interface IGDNPR2 {
  passportNumber?: string;
  passportType?: string;
  passportSequenceNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
}

export interface IGDNPR3 {
  visaNumber?: string;
  visaExpiryDate?: Date;
  visaType?: string;
  residentPermitNumber?: string;
  residentPermitExpiryDate?: Date;
  typeOfResident?: string;
}

export interface IGDT2 {
  disabilityCode?: string;
  visionCode?: string;
}
