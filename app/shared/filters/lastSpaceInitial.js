/**
 * Returns a string in the form Last F"
 * Expects an object with properties: firstName, and lastName
 * Removes the "." from the generic instructor "The Staff"
 */

sharedApp.filter("lastSpaceInitial", this.lastSpaceInitial = function() {
	return function (instructor) {
		if (!(instructor && instructor.firstName && instructor.lastName)) { return; }
		var firstInitial = instructor.firstName.charAt(0);
		return [instructor.lastName, firstInitial].filter(function(name) {
			return name.trim() !== ".";
		}).join(" ");
	};
});