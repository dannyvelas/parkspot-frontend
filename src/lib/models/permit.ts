import * as decoders from "decoders";
import type { Car, NewCarReq } from "./car";
import { carDecoder } from "./car";

export type Permit = {
  id: number;
  residentID: string;
  car: Car;
  startDate: Date;
  endDate: Date;
  requestTS: number;
  affectsDays: boolean;
  exceptionReason?: string | null;
};

export const permitDecoder: decoders.Decoder<Permit> = decoders.object({
  id: decoders.number,
  residentID: decoders.string,
  car: carDecoder,
  startDate: decoders.iso8601,
  endDate: decoders.iso8601,
  requestTS: decoders.number,
  affectsDays: decoders.boolean,
  exceptionReason: decoders.maybe(decoders.string),
});

export const preview = (permit: Permit) => {
  return `
    ${permit.id}
    ${permit.residentID}
    ${permit.car.licensePlate}
    ${permit.car.color}
    ${permit.car.make}
    ${permit.car.model}`;
};

export type NewPermitReq = {
  residentID: string;
  car: NewCarReq;
  startDate: string;
  endDate: string;
  exceptionReason: string;
};
