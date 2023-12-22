<script>
	import { onMount, onDestroy } from 'svelte';

	/**
	 * @type {string}
	 */
	export let timestamp; // The input timestamp in the format "2023-07-14T08:49:31.000Z"
	/**
	 * @type {string | number | NodeJS.Timer | undefined}
	 */
	let interval;

	function getRelativeTimeDifference() {
		const currentTime = Date.now();
		const parsedTimestamp = Date.parse(timestamp);
		const timeDifference = currentTime - parsedTimestamp;
		const seconds = Math.floor(timeDifference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(months / 12);

		if (years > 0) {
			return years === 1 ? 'a year ago' : `${years} years ago`;
		}
		if (months > 0) {
			return months === 1 ? 'a month ago' : `${months} months ago`;
		}
		if (days > 0) {
			return days === 1 ? 'a day ago' : `${days} days ago`;
		}
		if (hours > 0) {
			return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
		}
		if (minutes > 0) {
			return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
		}
		return seconds <= 5 ? 'just now' : `${seconds} seconds ago`;
	}

	$: relativeTime = getRelativeTimeDifference();

	// Update relativeTime every minute to keep it updated
	onMount(() => {
		interval = setInterval(() => {
			relativeTime = getRelativeTimeDifference();
		}, 60_000); // 60,000 milliseconds = 1 minute
	});

	// Cleanup interval when the component is destroyed
	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<!-- Display the relative time -->
<p>{relativeTime}</p>
