import * as decoders from 'decoders';
import type { Car, NewCarReq } from './car';
import { carDecoder } from './car';

export type Permit = {
	id: number;
	residentId: string;
	car: Car;
	startDate: Date;
	endDate: Date;
	requestTS: number;
	affectsDays: boolean;
	exceptionReason?: string | null;
};

export const permitDecoder: decoders.Decoder<Permit> = decoders.object({
	id: decoders.number,
	residentId: decoders.string,
	car: carDecoder,
	startDate: decoders.iso8601,
	endDate: decoders.iso8601,
	requestTS: decoders.number,
	affectsDays: decoders.boolean,
	exceptionReason: decoders.maybe(decoders.string)
});

export type NewPermitReq = {
	residentId: string;
	car: NewCarReq;
	startDate: string;
	endDate: string;
	exceptionReason: string;
};
