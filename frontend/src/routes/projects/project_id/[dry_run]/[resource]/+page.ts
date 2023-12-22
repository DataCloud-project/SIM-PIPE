export function load({ params }): { resource: string } {
	const { resource } = params as { resource?: string };
	if (!resource) {
		throw new Error('Resource not specified');
	}
	return { resource };
}
