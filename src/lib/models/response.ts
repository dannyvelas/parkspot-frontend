import * as decoders from 'decoders';

export type EmptyResponse = {
	ok: boolean;
};

export const emptyResponseDecoder: decoders.Decoder<EmptyResponse> = decoders.object({
	ok: decoders.boolean
});
