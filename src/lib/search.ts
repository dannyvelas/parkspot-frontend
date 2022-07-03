import type { Permit } from '$lib/models';
import type { Result } from '$lib/functional';
import { listWithMetadataDecoder, permitDecoder } from '$lib/models';
import { get } from '$lib/api';
import { isOk, newOk, newErr } from '$lib/functional';

export async function searchPermits(
	searchVal: string,
	initialPermits: Array<Permit>,
	totalAmtPermits: number,
	listType: 'all' | 'expired' | 'active' | 'exceptions'
): Promise<Result<Array<Permit>>> {
	if (searchVal === '') {
		return newOk(initialPermits);
	}

	if (totalAmtPermits == initialPermits.length) {
		return newOk(
			initialPermits.filter((permit) => {
				const searchableFields = `
          ${permit.id}
          ${permit.residentId}
          ${permit.car.licensePlate}
          ${permit.car.color}
          ${permit.car.make}
          ${permit.car.model}`.toLowerCase();
				return searchableFields.includes(searchVal.toLowerCase());
			})
		);
	}

	const getRes = await get(
		'api/permits/search',
		{ search: searchVal, listType: listType },
		listWithMetadataDecoder(permitDecoder)
	);
	if (!isOk(getRes)) {
		return newErr(getRes.message);
	}

	return newOk(getRes.data.records);
}
