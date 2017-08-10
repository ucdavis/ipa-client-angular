dateToRelative = function (date) {
	return moment(date).startOf('hour').fromNow();  
};

dateToCalendar = function (date) {
	return moment(date).calendar();  
};