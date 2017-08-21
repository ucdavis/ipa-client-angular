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