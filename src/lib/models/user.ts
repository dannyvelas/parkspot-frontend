import * as decoders from 'decoders';

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
};

export const userDecoder: decoders.Decoder<User> = decoders.object({
	id: decoders.string,
	firstName: decoders.string,
	lastName: decoders.string,
	email: decoders.string,
	role: decoders.string
});
