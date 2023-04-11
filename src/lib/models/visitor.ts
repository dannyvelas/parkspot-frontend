import * as decoders from "decoders";

export type Visitor = {
  id: string;
  residentID: string;
  firstName: string;
  lastName: string;
  relationship: string;
  accessStart: Date;
  accessEnd: Date;
};

export const visitorDecoder: decoders.Decoder<Visitor> = decoders.object({
  id: decoders.string,
  residentID: decoders.string,
  firstName: decoders.string,
  lastName: decoders.string,
  relationship: decoders.string,
  accessStart: decoders.iso8601,
  accessEnd: decoders.iso8601,
});
