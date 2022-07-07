import * as decoders from "decoders";

export type Car = {
  id: string;
  licensePlate: string;
  color: string;
  make: string;
  model: string;
  amtParkingDaysUsed: number;
};

export const carDecoder: decoders.Decoder<Car> = decoders.object({
  id: decoders.string,
  licensePlate: decoders.string,
  color: decoders.string,
  make: decoders.string,
  model: decoders.string,
  amtParkingDaysUsed: decoders.number,
});

export type EditCarArgs = {
  color: string;
  make: string;
  model: string;
};

export type NewCarReq = {
  licensePlate: string;
  color: string;
  make: string;
  model: string;
};
