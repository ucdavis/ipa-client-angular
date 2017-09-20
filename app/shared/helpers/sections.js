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
