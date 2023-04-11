import * as decoders from "decoders";

export type Permit = {
  id: number;
  residentID: string;
  carID: string;
  licensePlate: string;
  color: string;
  make: string;
  model: string;
  startDate: Date;
  endDate: Date;
  requestTS: number;
  affectsDays: boolean;
  exceptionReason?: string | null;
};

export const permitDecoder: decoders.Decoder<Permit> = decoders.object({
  id: decoders.number,
  residentID: decoders.string,
  carID: decoders.string,
  licensePlate: decoders.string,
  color: decoders.string,
  make: decoders.string,
  model: decoders.string,
  startDate: decoders.iso8601,
  endDate: decoders.iso8601,
  requestTS: decoders.number,
  affectsDays: decoders.boolean,
  exceptionReason: decoders.maybe(decoders.string),
});
