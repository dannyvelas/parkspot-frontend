import * as decoders from "decoders";

export type Resident = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  unlimDays: boolean;
  amtParkingDaysUsed: number;
};

export const residentDecoder: decoders.Decoder<Resident> = decoders.object({
  id: decoders.string,
  firstName: decoders.string,
  lastName: decoders.string,
  phone: decoders.string,
  email: decoders.string,
  unlimDays: decoders.boolean,
  amtParkingDaysUsed: decoders.number,
});

export const preview = (resident: Resident) => {
  return `
    ${resident.id}
    ${resident.firstName}
    ${resident.lastName}
  `;
};
