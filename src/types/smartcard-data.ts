export interface SmartcardData {
  cprNumber?: string;
  firstNameEn?: string;
  middleNameEn1?: string;
  middleNameEn2?: string;
  middleNameEn3?: string;
  middleNameEn4?: string;
  lastNameEn?: string;
  fullNameEn?: string;
  ArabicFirstName?: string;
  ArabicFullName?: string;
  ArabicLastName?: string;
  ArabicMiddleName2?: string;
  ArabicMiddleName3?: string;
  ArabicMiddleName4?: string;
  ArabicMiddleName5?: string;
  AddressArabic?: string;
  AddressEnglish?: string;
  BirthDate?: string;
  CardCountry?: string;
  CardexpiryDate?: string;
  CardIssueDate?: string;
  CardSerialNumber?: string;
  CardVersion?: string;
  EmploymentFlag?: string;
  EmploymentId?: string;
  EmploymentNameArabic?: string;
  EmploymentNameEnglish?: string;
  FingerprintCode?: string;
  Gender?: string;
  IacoNationalityCode?: string;
  IsoNationalityCode?: string;
  IdNumber?: string;
  IsMatchOnCardAvailiable?: string;
  MiscellaneousBinaryData?: {
    CountryFlagMini?: string;
  };
  MiscellaneousTextData?: {
    FirstNameArabic?: string;
    LastNameArabic?: string;
    MiddleName1Arabic?: string;
    MiddleName2Arabic?: string;
    MiddleName3Arabic?: string;
    MiddleName4Arabic?: string;
    BloodGroup?: string;
    CPRNO?: string;
    DateOfBirth?: string;
    FirstNameEnglish?: string;
    LastNameEnglish?: string;
    MiddleName1English?: string;
    MiddleName2English?: string;
    MiddleName3English?: string;
    MiddleName4English?: string;
    Gender?: string;
    Email?: string;
    ContactNo?: string;
    ResidenceNo?: string;
    FlatNo?: string;
    BuildingNo?: string;
    BuildingAlpha?: string;
    BuildingAlphaArabic?: string;
    RoadNo?: string;
    RoadName?: string;
    RoadNameArabic?: string;
    BlockNo?: string;
    BlockName?: string;
    BlockNameArabic?: string;
    GovernorateNo?: string;
    GovernorateNameEnglish?: string;
    GovernorateNameArabic?: string;
    EmployerName1Arabic?: string;
    LatestEducationDegreeArabic?: string;
    OccupationDescription1Arabic?: string;
    SponsorNameArabic?: string;
    ClearingAgentIndicator?: string;
    EmployerFlag1?: string;
    EmployerName1?: string;
    EmployerNo1?: string;
    EmploymentFlag1?: string;
    LaborForceParticipation?: string;
    LatestEducationDegree?: string;
    OccupationDescription1?: string;
    SponsorCPRNoorUnitNo?: string;
    SponsorFlag?: string;
    SponsorName?: string;
    LfpNameEnglish?: string;
    LfpNameArabic?: string;
    EnglishCountryName?: string;
    ArabicCountryName?: string;
    IACOCode?: string;
    Alpha2Code?: string;
    Alpha3Code?: string;
    Nationality?: string;
    CountryOfBirth?: string;
    PassportNo?: string;
    PassportType?: string;
    PassportSequnceNo?: string;
    IssueDate?: string;
    ExpiryDate?: string;
    VisaNo?: string;
    VisaExpiryDate?: string;
    VisaType?: string;
    ResidentPermitNo?: string;
    ResidentPermitExpiryDate?: string;
    TypeOfResident?: string;
    CardVerificationStatus?: "Active" | "NotActive";
  };
  NationalityCode?: string;
  OccupationArabic?: string;
  OccupationEnglish?: string;
  PassportExpiryDate?: string;
  PassportIssueDate?: string;
  PassportNumber?: string;
  PassportType?: string;
  Photo?: string;
  SignB64Encoded?: string;
  SponserId?: string;
  SponserNameArabic?: string;
  SponserNameEnglish?: string;
  ErrorDescription?: string;
}
