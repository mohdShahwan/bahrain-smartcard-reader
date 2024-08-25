import { CardTypes } from "../types";

export default function getInsertedCardType(knownATR: string): CardTypes {
  if (knownATR === "3B670000A81041" || knownATR.startsWith("3B670000A81041")) {
    return CardTypes.v1;
  }

  if (
    knownATR === "3B7A9600008065A2010101" ||
    knownATR === "3B888001E1F35E1177" ||
    knownATR.startsWith("3B7A9600008065A2010101") ||
    knownATR.startsWith("3B888001E1F35E1177")
  ) {
    return CardTypes.v2;
  }

  return knownATR === "3B7F96000080318065B085" ||
    knownATR.startsWith("3B7F96000080318065B085")
    ? CardTypes.v4
    : CardTypes.unknown;
}
