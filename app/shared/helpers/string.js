export function getRoleDisplayName(roleString) {
	if (typeof roleString !== 'string') { return ""; }

	if (roleString == "studentPhd") {
		return "Student PhD";
	}

	var lowercase = roleString.replace(/([A-Z])/g, " $1");
	return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
}

export function toCurrency(number) {
	if (!number) {
		return "$0.00";
	}

	var currency = (parseFloat(number)).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	return currency;
}

export function setCharAt(str, index, chr) {
	// If index is out of bounds, do nothing
	if (index > str.length - 1) { return str; }

	return str.substr(0,index) + chr + str.substr(index + 1);
}