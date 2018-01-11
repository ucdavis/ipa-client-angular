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

millisecondsToDate = function(milliseconds) {
	if (milliseconds == false || milliseconds == null) {
		return "";
	}
	var d = new Date(milliseconds);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var formattedDate = year + "-" + month + "-" + day;
	formattedDate = moment(formattedDate, "YYYY-MM-DD").format('LL');

	return formattedDate;
};
isCurrentTerm = function(termStart, termEnd) {
	var now = moment();

	if (now.isBefore(moment(termEnd)) && moment(termStart).isBefore(now)) {
		return true;
	}

	return false;
};