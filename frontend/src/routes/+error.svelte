<script context="module">
	throw new Error("@migration task: Replace error load function (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3293209)");

	// export function load({ error, status }) {
	// 	return {
	// 		props: {
	// 			title: `${status}: ${error.message}`
	// 		}
	// 	};
	// }
</script>

<script>
	export let title;
</script>

<h1>Oops..</h1>
<h2>{title}</h2>
