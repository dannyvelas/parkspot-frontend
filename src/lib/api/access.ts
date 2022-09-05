import * as decoders from "decoders";

export type accessPayload = {
  id: string;
  role: string;
};

export type accessClaims = {
  accessPayload: accessPayload;
  exp: number;
};

export const accessPayloadDecoder: decoders.Decoder<accessPayload> = decoders.object({
  id: decoders.string,
  role: decoders.string,
});

export const accessClaimsDecoder: decoders.Decoder<accessClaims> = decoders.object({
  accessPayload: accessPayloadDecoder,
  exp: decoders.number
});
