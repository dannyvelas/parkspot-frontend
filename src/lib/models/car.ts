import * as decoders from "decoders";

export type Car = {
  residentID: string;
  id: string;
  licensePlate: string;
  color: string;
  make: string;
  model: string;
  amtParkingDaysUsed: number;
};

export const carDecoder: decoders.Decoder<Car> = decoders.object({
  residentID: decoders.string,
  id: decoders.string,
  licensePlate: decoders.string,
  color: decoders.string,
  make: decoders.string,
  model: decoders.string,
  amtParkingDaysUsed: decoders.number,
});
