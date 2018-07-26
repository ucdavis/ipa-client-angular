/**
 * @ngdoc service
 * @name ipaClientAngularApp.SectionService
 * @description
 */
class SectionService {
	constructor () {
		return {
			// Ensures sequence pattern conforms to the rules for either numeric or letter based sequence patterns.
			isSequenceNumberFormatValid: function(sequenceNumber) {
				// Must exist to be valid
				if (!sequenceNumber) { return false; }

				var stringSequenceNumber = String(sequenceNumber);

				// Sequence pattern must be 3 characters
				if (stringSequenceNumber.length != 3) { return false; }

				// First character must be a letter or number
				if (isNumber(stringSequenceNumber[0]) == false && isLetter(stringSequenceNumber[0]) == false) { return false; }

				// If first character is a letter, it must be capitalized
				if (isLetter(stringSequenceNumber[0]) && stringSequenceNumber[0] != stringSequenceNumber[0].toUpperCase()) { return false; }

				// Second character must be a number
				if (isNumber(stringSequenceNumber[1]) == false) { return false; }

				// Third character must be a number
				if (isNumber(stringSequenceNumber[2]) == false) { return false; }

				return true;
			},
			// Will potentially zero pad numeric sequenceNumber, and ensure letter based sequenceNumber have the letter capitalized.
			// Designed to flexibly handle incomplete sequence sequenceNumber when possible
			formatSequenceNumber: function (sequenceNumber) {
				// Sequence pattern is invalid and unfixable
				if (!sequenceNumber || sequenceNumber.length > 3) { return sequenceNumber; }

				// Handle numeric patterns
				if (isNumber(sequenceNumber)) {
					if (sequenceNumber.toString().length == 2) {
						return "0" + sequenceNumber;
					}
	
					if (sequenceNumber.toString().length == 1) {
						return "00" + sequenceNumber;
					}
	
					return sequenceNumber;	
				}

				// If the letter based sequenceNumber at least starts with a letter, we can ensure its capitalized
				if (isLetter(sequenceNumber[0])) {
					return sequenceNumber[0].toUpperCase() + sequenceNumber.slice(1);
				}
			},
			isSequencePatternValid: function (sequencePattern) {
				// Must exist to be valid
				if (!sequencePattern) { return false; }

				var stringSequenceNumber = String(sequencePattern);

				// First character must be a letter or number
				if (isNumber(stringSequenceNumber[0]) == false && isLetter(stringSequenceNumber[0]) == false) { return false; }

				// If first character is a letter
				if (isLetter(stringSequenceNumber[0])) {
					// Must be capitalized
					if (stringSequenceNumber[0] != stringSequenceNumber[0].toUpperCase()) { return false; }

					// Must be one character long
					if (stringSequenceNumber.length > 1) { return false; }
				} else {
					// Numeric section
					// Second character must be a number
					if (isNumber(stringSequenceNumber[1]) == false) { return false; }

					// Third character must be a number
					if (isNumber(stringSequenceNumber[2]) == false) { return false; }
				}

				return true;

			}
		};
	}
}

export default SectionService;
