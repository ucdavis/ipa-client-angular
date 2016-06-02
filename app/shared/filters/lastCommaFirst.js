/**
 * Returns a string in the form Last, First"
 * Expects an object with properties: firstName, and lastName
 * Removes the "." from the generic instructor "The Staff"
 */

sharedApp.filter("lastCommaFirst", this.lastCommaFirst = function() {
	return function (instructor) {
		if (!(instructor && instructor.firstName && instructor.lastName)) return;
		return [instructor.lastName, instructor.firstName].filter(function(name) {
			return name.trim() !== ".";
		}).join(", ");
	};
});