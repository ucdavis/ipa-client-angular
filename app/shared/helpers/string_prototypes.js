// Converts a 4-digit year to academic year format. Example: 2015 -> 2015-16
String.prototype.yearToAcademicYear = function () {
	return this + "-" + (Number(this) + 1).toString().slice(-2);
};

/**
 * Converts 24 'military time' to 12 hour am/pm time
 * handled cases:
 * - "13:00:00"
 * - "13:00"
 * - "1300"
 */
String.prototype.toStandardTime = function () {
	var returnFormat = "h:mm A";
	if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-9][0-9]$/.test(this)) {
		// Case "13:00:00"
		return moment(this, "HH:mm:ss").format(returnFormat); // eslint-disable-line no-undef
	} else if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(this)) {
		// Case "13:00"
		return moment(this, "HH:mm").format(returnFormat); // eslint-disable-line no-undef
	} else if (/^([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/.test(this)) {
		// Case "1300"
		return moment(this, "HHmm").format(returnFormat); // eslint-disable-line no-undef
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

String.prototype.getTermDisplayName = function () {
	var code = this;

	if (code.length != 2) {
		return "";
	}

	var termDescriptions = {
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

	return termDescriptions[code];
};

// Turns '2016-10-01' into 'October 1st 2016'
String.prototype.toFullDate = function () {
	if (this.length === 0) {
		return "";
	}

	return moment(this, "YYYY-MM-DD").format('LL'); // eslint-disable-line no-undef
};

// Turns 'D' into 'Discussion'
// FIXME: Do not extend String.prototype for this functionality.
String.prototype.getActivityCodeDescription = function () {
	var codeDescriptions = {
		'%': "World Wide Web Electronic Discussion",
		'0': "World Wide Web Virtual Lecture",
		'1': "Conference",
		'2': "Term Paper/Discussion",
		'3': "Film Viewing",
		'6': "Dummy Course",
		'7': "Combined Schedule",
		'8': "Project",
		'9': "Extensive Writing or Discussion",
		'A': "Lecture",
		'B': "Lecture/Discussion",
		'C': "Laboratory",
		'D': "Discussion",
		'E': "Seminar",
		'F': "Fieldwork",
		'G': "Discussion/Laboratory",
		'H': "Laboratory/Discussion",
		'I': "Internship",
		'J': "Independent Study",
		'K': "Workshop",
		'L': "Lecture/Lab",
		'O': "Clinic",
		'P': "PE Activity",
		'Q': "Listening",
		'R': "Recitation",
		'S': "Studio",
		'T': "Tutorial",
		'U': "Auto Tutorial",
		'V': "Variable",
		'W': "Practice",
		'X': "Performance Instruction",
		'Y': "Rehearsal",
		'Z': "Term Paper"
	};
	return codeDescriptions[this];
};

// Turns 0101010 into MWF
String.prototype.getWeekDays = function () {
	if (!this || this.length == 0) {
		return "";
	}

	var days = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
	var dayArr = this.split('');

	var dayStr = '';
	angular.forEach(dayArr, function (day, i) { // eslint-disable-line no-undef
				if (day === '1') { dayStr = dayStr + days[i]; }
	});

	return dayStr;
};

String.prototype.camelToTitle = function() {
	return this
		.replace(/([A-Z])/g, ' $1') // Add a space before uppercase letters
		.replace(/^./, (char) => char.toUpperCase()) // Capitalize the first character
		.trim(); // Remove leading/trailing spaces
};