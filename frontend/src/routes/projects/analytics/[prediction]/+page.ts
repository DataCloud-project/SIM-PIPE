export function load({ params }): { prediction: string } {
	const { prediction } = params as { prediction?: string };
	if (!prediction) {
		throw new Error('Prediction not specified');
	}
	return { prediction };
}
