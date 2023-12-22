export function load({ params }): { template: string | undefined } {
	const { template } = params as { template?: string };
	return { template };
}
