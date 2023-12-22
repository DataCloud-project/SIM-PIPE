export function load({ params }): { template: string } {
	const { template } = params as { template?: string };
	if (!template) {
		throw new Error('Template not specified');
	}
	return { template };
}
