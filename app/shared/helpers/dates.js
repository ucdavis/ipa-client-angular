dateToRelative = function (date) {
	if (!date) {
		return "";
	}

	return moment(date).fromNow();  
};

dateToCalendar = function (date) {
	if (!date) {
		return "";
	}
	return moment(date).calendar();  
};

isCurrentTerm = function(termStart, termEnd) {
	var now = moment();

	if (now.isBefore(moment(termEnd)) && moment(termStart).isBefore(now)) {
		return true;
	}

	return false;
};