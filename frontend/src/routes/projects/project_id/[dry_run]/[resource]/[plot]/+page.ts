export function load({ params }): { plot: string } {
	const { plot } = params as { plot?: string };
	if (!plot) {
		throw new Error('Plot not specified');
	}
	return { plot };
}
