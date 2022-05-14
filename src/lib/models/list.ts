import * as decoders from 'decoders';

export type Metadata = {
	totalAmount: number;
};

export type ListWithMetadata<T> = {
	records: Array<T>;
	metadata: Metadata;
};

export const listWithMetadataDecoder = <T>(
	memberDecoder: decoders.Decoder<T>
): decoders.Decoder<ListWithMetadata<T>> =>
	decoders.object({
		records: decoders.array(memberDecoder),
		metadata: metadataDecoder
	});

const metadataDecoder: decoders.Decoder<Metadata> = decoders.object({
	totalAmount: decoders.number
});
