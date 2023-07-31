export async function load({ params }) {
	let { dry_run } = params;
	return { dry_run };
}
