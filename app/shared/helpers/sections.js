// Will calculate the proper sequencePattern for the first section of a course
firstSequencePattern = function (course) {
	if (!course) {
		return null;
	}

	// Letter based
	if (course.isSeries() === true) {
		return course.sequencePattern + "01";
	}

	// Numeric
	return course.sequencePattern;
};

nextSequenceNumber = function (course, sectionGroup, sections) {
	if (!course) {
		return null;
	}

	// Numeric
	if (course.isSeries() === false) {
		return course.sequencePattern;
	}
	// Letter based
	var lastSequenceNumber = null;
	var newNumber = null;

	if (sections.length > 0) {
		sections.forEach(function(section) {
			if (!lastSequenceNumber || section.sequenceNumber > lastSequenceNumber) {
				lastSequenceNumber = section.sequenceNumber;
			}
		});

		newNumber = parseInt(lastSequenceNumber.slice(-2)) + 1;

		if (newNumber < 10) {
			newNumber = "0" + newNumber;
		}
	} else {
		newNumber = "01";
	}

	return course.sequencePattern + newNumber;
};