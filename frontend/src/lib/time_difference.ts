export function time_difference(started: string, finished: string) {
	const timeDifferenceMilliseconds = new Date(finished).getTime() - new Date(started).getTime();

	const hours = Math.floor(timeDifferenceMilliseconds / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifferenceMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifferenceMilliseconds % (1000 * 60)) / 1000);

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

	if (seconds >= 0) {
		if (timeDifferenceString) {
			timeDifferenceString += ' ';
		}
		timeDifferenceString += `${seconds} second${seconds > 1 ? 's' : ''}`;
	}
	return timeDifferenceString;
}
