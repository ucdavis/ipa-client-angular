// Returns false on null, undefined, zero characters, or only whitespace
isEmpty = function(value) {
	return (!value || value.length === 0 || !value.trim() );
};

// Returns the appropriate suffix, e.g. 1st, 2nd, 3rd, 4th, etc.
toOrdinalSuffix = function(value) {
	var j = value % 10,
	k = value % 100;
	if (j == 1 && k != 11) {
		return value + "st";
	}
	if (j == 2 && k != 12) {
		return value + "nd";
	}
	if (j == 3 && k != 13) {
		return value + "rd";
	}
	return value + "th";
};

// Removes leading zeroes from a number
toNumber = function(value) {
	return Number(value).toString();
};

// Returns a consistent hex color for the passed string
var _colorCache = {};
getHexColor = function(str) {
	if (!str) return null;
	if (_colorCache[str]) return _colorCache[str];

	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	var color = '#';
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xFF;
		color += ('00' + value.toString(16)).substr(-2);
	}
	_colorCache[str] = color;
	return color;
};

// Converts 24 'military time' to 12 hour am/pm time
toStandardTime = function(value) {
	//If value is passed in
	if (value !== null && value !== undefined) {
		//If time is already in standard time then don't format.
		if(value.indexOf('AM') > -1 || value.indexOf('PM') > -1) {
			return value;
		} else {
			 //If value is the expected length for military time then process to standard time.
			if(value.length == 8) {
				var hour = value.substring ( 0,2 ); //Extract hour
				var minutes = value.substring ( 3,5 ); //Extract minutes
				var identifier = 'AM'; //Initialize AM PM identifier

				if(hour == 12){ //If hour is 12 then should set AM PM identifier to PM
					identifier = 'PM';
				}
				if(hour == 0){ //If hour is 0 then set to 12 for standard time 12 AM
					hour=12;
				}
				if(hour > 12){ //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
					hour = hour - 12;
					identifier='PM';
				}
				return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
			} else { //If value is not the expected length than just return the value as is
				return value;
			}
		}
	}
};