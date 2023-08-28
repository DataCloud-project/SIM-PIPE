export async function load({ params }) {
	let { dry_run } = params.project_id;
	return { dry_run };
}