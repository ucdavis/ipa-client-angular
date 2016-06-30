// TODO: Rename to _array_getElementById
_array_findById = function(arr, id) {
	var index = _array_getIndexById(arr, id);

	if (index == -1) {
		return undefined;
	}

	return arr[index];
}

_array_getIndexById = function (arr, id) {
	return arr.findIndex( function(n) {
		return n.id == id;
	});
}

/**
 * Returns a sorted array of Ids based on the value of a
 * property in a corresponding object of objects (listHash).
 *
 * Example:
 * listHash = { 1: {name: "Chris"}, 2: {name: "Adam"}, 3: {name: "Bob"} };
 * property = "name"
 * Returns ==> [2, 3, 1]
 *
 * @param {object of objects} listHash - An object of which the keys are the ids of its objects.
 * @param {string} property - The property that the sorter will be comparing.
 * @returns {array} The sorted array
 */
_array_sortIdsByProperty = function (listHash, property) {
	var keys = Object.keys(listHash);
	return keys.sort(function (a, b) {
		var valA = listHash[a][property];
		var valB = listHash[b][property];

		// If the properties are strings, ignore the case
		if (typeof valA == "string") { valA = valA.toUpperCase(); }
		if (typeof valB == "string") { valB = valB.toUpperCase(); }

		if (valA < valB) { return -1; }
		if (valA > valB) { return 1; }
		return 0;
	}).map(function(id) { return parseInt(id); });
}