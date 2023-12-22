export async function load({ params }) {
	const { dry_run } = params;
	return { dry_run };
}
