/**
 * @ngdoc service
 * @name ipaClientAngularApp.SectionService
 * @description
 */
class SectionService {
	constructor () {
		return {
			// Ensures sequence pattern conforms to the rules for either numeric or letter based sequence patterns.
			isSequencePatternFormatValid: function(sequencePattern) {
				// Must exist to be valid
				if (!sequencePattern) { return false; }

				var stringSequencePattern = String(sequencePattern);

				// Sequence pattern must be 3 characters
				if (stringSequencePattern.length != 3) { return false; }

				// First character must be a letter or number
				if (isNumber(stringSequencePattern[0]) == false && isLetter(stringSequencePattern[0]) == false) { return false; }

				// If first character is a letter, it must be capitalized
				if (isLetter(stringSequencePattern[0]) && stringSequencePattern[0] != stringSequencePattern[0].toUpperCase()) { return false; }

				// Second character must be a number
				if (isNumber(stringSequencePattern[1]) == false) { return false; }

				// Third character must be a number
				if (isNumber(stringSequencePattern[2]) == false) { return false; }

				return true;
			},
			// Will potentially zero pad numeric patterns, and ensure letter based patterns have the letter capitalized.
			// Designed to flexibly handle incomplete sequence patterns when possible
			formatSequencePattern: function (sequencePattern) {
				// Sequence pattern is invalid and unfixable
				if (!sequencePattern || sequencePattern.length > 3) { return sequencePattern; }

				// Handle numeric patterns
				if (isNumber(sequencePattern)) {
					if (sequencePattern.toString().length == 2) {
						return "0" + sequencePattern;
					}
	
					if (sequencePattern.toString().length == 1) {
						return "00" + sequencePattern;
					}
	
					return sequencePattern;	
				}

				// If the letter pattern at least starts with a letter, we can ensure its capitalized
				if (isLetter(sequencePattern[0])) {
					return sequencePattern[0].toUpperCase() + sequencePattern.slice(1);
				}
			}
		};
	}
}

export default SectionService;
