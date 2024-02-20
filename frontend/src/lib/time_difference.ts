export function readable_time_difference(started: string, finished: string) {
	const timeDifferenceMilliseconds = new Date(finished).getTime() - new Date(started).getTime();
	return readable_time(timeDifferenceMilliseconds);
}

export function readable_time(milliseconds: number) {
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

	if (timeDifferenceString == '') return (milliseconds / 1000.0).toFixed(3);
	return timeDifferenceString;
}
