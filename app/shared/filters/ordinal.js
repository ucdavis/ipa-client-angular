/**
 * Returns a string in the form 5th"
 * Expects an Integer
 */

import { isNumber } from 'shared/helpers/types';

let ordinal = function() {
	return function (number) {
		if (number && isNumber(number)) {
			return toOrdinalSuffix(number);// eslint-disable-line no-undef
		}
	};
};

export default ordinal;