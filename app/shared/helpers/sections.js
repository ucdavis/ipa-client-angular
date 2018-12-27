export function nextSequenceNumber(course, sectionGroup, sections) {
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
}

export function sequenceNumberToPattern(sequenceNumber) {
	if (sequenceNumber.length != 3) { return null; }

	// sequencePattern is letter based (example 'A02')
	if (sequenceNumber.toLowerCase() != sequenceNumber.toUpperCase()) {
		return sequenceNumber[0].toUpperCase();
	}

	// sequencePattern is numeric
	return sequenceNumber;
}
