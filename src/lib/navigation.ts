import type { User } from '$lib/models';

export function dashboard(user: User): string {
	return user.role === 'resident' ? `/resident` : '/admin';
}
