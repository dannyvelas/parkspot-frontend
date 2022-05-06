import * as decoders from 'decoders';

export type Admin = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isPrivileged: boolean;
};

export const adminDecoder: decoders.Decoder<Admin> = decoders.object({
	id: decoders.string,
	firstName: decoders.string,
	lastName: decoders.string,
	email: decoders.string,
	isPrivileged: decoders.boolean
});
