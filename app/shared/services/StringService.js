class StringService {
  constructor () {
    // Intentionally blank
  }

  // Returns false on null, undefined, zero characters, or only whitespace
  isEmpty () {
    return (!this || this.length === 0 || !this.trim());
  }

  // Returns the appropriate suffix, e.g. 1st, 2nd, 3rd, 4th, etc.
  appendOrdinalSuffix () {
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
  }

  // Removes leading zeroes from a number
  toNumber () {
    return Number(this).toString();
  }

  // Converts a 4-digit year to academic year format. Example: 2015 -> 2015-16
  yearToAcademicYear () {
    return this + "-" + (Number(this) + 1).toString().slice(-2);
  }

  /**
   * Converts 24 'military time' to 12 hour am/pm time
   * handled cases:
   * - "13:00:00"
   * - "13:00"
   * - "1300"
   */
  toStandardTime () {
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
  }

  /**
   * Returns the registrar's name for the term code
   * Example: 201610 -> 2016 Fall Quarter
   *
   * @params [optional] excludeYear
   */
  getTermCodeDisplayName (excludeYear) {
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
  }

  getTermDisplayName () {
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
  }

  // Turns '2016-10-01' into 'October 1st 2016'
  toFullDate () {
    if (this.length === 0) {
      return "";
    }

    return moment(this, "YYYY-MM-DD").format('LL'); // eslint-disable-line no-undef
  }

  // Turns 'D' into 'Discussion'
  getActivityCodeDescription () {
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
  }

  // Turns 0101010 into MWF
  getWeekDays () {
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
  }

  toAcademicYear(year) {
    var nextYearShort = (Number(year) + 1).toString().slice(-2);
    return year + "-" + nextYearShort;
  }

  isDay(tab) {
    if (!tab || tab.length == 0) { return false; }

    switch (tab.toLowerCase()) {
      case "sunday":
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
        return true;
      default:
        return false;
    }
  }

  // Credit: https://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript
  truncate(str, n) {
    return (str.length > n) ? str.substr(0, n - 3) + '...' : str;
  }
}

export default StringService;
