export function dateToRelative(date) {
	if (!date) {
		return "";
	}

	return moment(date).fromNow(); // eslint-disable-line no-undef
}

export function dateToCalendar(date) {
	if (!date) {
		return "";
	}
	return moment(date).calendar(); // eslint-disable-line no-undef
}

export function millisecondsToDate(milliseconds) {
	if (milliseconds == false || milliseconds == null) {
		return "";
	}
	var d = new Date(milliseconds);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var formattedDate = year + "-" + month + "-" + day;
	formattedDate = moment(formattedDate, "YYYY-MM-DD").format('LL'); // eslint-disable-line no-undef

	return formattedDate;
}

// Will return the number of minutes between now and the datetime.
// If datetime is in the future the number will be negative, and if datetime is in the past the number will be positive.
// Expects datetime in the format '1476082800000'
export function elapsedMinutes(datetime) {
	return moment().diff(datetime, 'minutes'); // eslint-disable-line no-undef
}

export function isCurrentTerm(termStart, termEnd) {
	var now = moment(); // eslint-disable-line no-undef

	if (now.isBefore(moment(termEnd)) && moment(termStart).isBefore(now)) { // eslint-disable-line no-undef
		return true;
	}

	return false;
}
