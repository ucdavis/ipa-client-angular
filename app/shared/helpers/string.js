// Returns false on null, undefined, zero characters, or only whitespace
String.prototype.isEmpty = function() {
	return (!this || this.length === 0 || !this.trim() );
};

// Returns the appropriate suffix, e.g. 1st, 2nd, 3rd, 4th, etc.
String.prototype.appendOrdinalSuffix = function() {
	var j = this % 10, k = this % 100;

	if (j == 1 && k != 11) {
		return this + "st";
	}
	if (j == 2 && k != 12) {
		return this + "nd";
	}
	if (j == 3 && k != 13) {
		return this + "rd";
	}
	return this + "th";
};

// Removes leading zeroes from a number
String.prototype.toNumber = function() {
	return Number(this).toString();
};

// Converts a 4-digit year to academic year format. Example: 2015 -> 2015-16
String.prototype.yearToAcademicYear = function() {
	return this + "-" + (Number(this) + 1).toString().slice(-2);
};

// Converts 24 'military time' to 12 hour am/pm time
String.prototype.toStandardTime = function () {
	//If time is already in standard time then don't format.
	if(this.indexOf('AM') > -1 || this.indexOf('PM') > -1) {
		return this;
	} else {
			//If value is the expected length for military time then process to standard time.
		if(this.length == 8) {
			var hour = this.substring ( 0,2 ); //Extract hour
			var minutes = this.substring ( 3,5 ); //Extract minutes
			var identifier = 'AM'; //Initialize AM PM identifier

			if(hour === 12){ //If hour is 12 then should set AM PM identifier to PM
				identifier = 'PM';
			}
			if(hour === 0){ //If hour is 0 then set to 12 for standard time 12 AM
				hour=12;
			}
			if(hour > 12){ //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
				hour = hour - 12;
				identifier='PM';
			}
			return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
		} else { //If value is not the expected length than just return the value as is
			return this;
		}
	}
};

/**
 * Returns the registrar's name for the term code
 * Example: 201610 -> 2016 Fall Quarter
 *
 * @params [optional] excludeYear
 */
String.prototype.getTermCodeDisplayName = function (excludeYear) {
	if (this.length !== 6) { return ""; }

	var year = this.substr(0, 4);
	var code = this.slice(-2);

	var _allTerms = {
		'05': 'Summer Session 1',
		'06': 'Summer Special Session',
		'07': 'Summer Session 2',
		'08': 'Summer Quarter',
		'09': 'Fall Semester',
		'10': 'Fall Quarter',
		'01': 'Winter Quarter',
		'02': 'Spring Semester',
		'03': 'Spring Quarter'
	};

	var description = excludeYear ? "" : year + ' ';
	description += _allTerms[code];
	return description;
};

// Turns '2016-10-01' into 'October 1st 2016'
String.prototype.toFullDate = function () {
	if (this.length === 0) {
		return "";
	}

	return moment(this, "YYYY-MM-DD").format('LL');
};