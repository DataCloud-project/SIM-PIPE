
export function readableTime(milliseconds: number): string {
	const hours = Math.floor(milliseconds / (1000 * 60 * 60));
	const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

	let timeDifferenceString = '';

	if (hours > 0) {
		timeDifferenceString += `${hours} hour${hours > 1 ? 's' : ''}`;
	}

	if (minutes > 0) {
		if (timeDifferenceString) {
			timeDifferenceString += ' ';
		}
		timeDifferenceString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
	}

	if (seconds > 0) {
		if (timeDifferenceString) {
			timeDifferenceString += ' ';
		}
		timeDifferenceString += `${seconds} second${seconds > 1 ? 's' : ''}`;
	}

	if (timeDifferenceString === '') return (milliseconds / 1000).toFixed(3);
	return timeDifferenceString;
}

export function readableTimeDifference(started: string, finished: string): string {
	const timeDifferenceMilliseconds = new Date(finished).getTime() - new Date(started).getTime();
	return readableTime(timeDifferenceMilliseconds);
}