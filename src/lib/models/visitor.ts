import * as decoders from "decoders";

export type Visitor = {
  id: string;
  residentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  accessStart: Date;
  accessEnd: Date;
};

export const visitorDecoder: decoders.Decoder<Visitor> = decoders.object({
  id: decoders.string,
  residentId: decoders.string,
  firstName: decoders.string,
  lastName: decoders.string,
  relationship: decoders.string,
  accessStart: decoders.iso8601,
  accessEnd: decoders.iso8601,
});

export const preview = (visitor: Visitor) => {
  return `
    ${visitor.residentId}
    ${visitor.firstName}
    ${visitor.lastName}`;
};
