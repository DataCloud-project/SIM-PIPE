export async function load({ params }) {
	const { prediction } = params;
	return { prediction };
}
