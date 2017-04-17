// TODO: Rename to _array_getElementById
_array_findById = function (arr, id) {
	var index = _array_getIndexById(arr, id);

	if (index == -1) {
		return undefined;
	}

	return arr[index];
};

_array_getIndexById = function (arr, id) {
	if (!(arr instanceof Array)) { return -1; }
	return arr.findIndex(function (n) {
		return n.id == id;
	});
};

/**
 * Returns a sorted array of Ids based on the value of a
 * property in a corresponding object of objects (listHash).
 *
 * Example:
 * listHash = { 1: {name: "Chris"}, 2: {name: "Adam"}, 3: {name: "Bob"} };
 * properties = "name"
 * Returns ==> [2, 3, 1]
 *
 * @param {object of objects} listHash - An object of which the keys are the ids of its objects.
 * @param {string or array of strings} properties - The property/properties that the sorter will be comparing.
 * @returns {array} The sorted array
 */
_array_sortIdsByProperty = function (listHash, properties) {
	var keys = Object.keys(listHash);
	return keys.sort(function (a, b) {
		var valA, valB;
		// Construct the comparator value by concatinating property values if the properties were passed as an array
		if (properties.constructor === Array) {
			valA = "";
			valB = "";
			for (var i in properties) {
				valA += listHash[a][properties[i]];
				valB += listHash[b][properties[i]];
			}
		} else {
			// This will accept a single property in the form of a string
			valA = listHash[a][properties];
			valB = listHash[b][properties];
		}

		// If the properties are strings, ignore the case
		if (typeof valA == "string") { valA = valA.toUpperCase(); }
		if (typeof valB == "string") { valB = valB.toUpperCase(); }

		if (valA < valB) { return -1; }
		if (valA > valB) { return 1; }
		return 0;
	}).map(function (id) { return parseInt(id); });
};

_array_sortByProperty = function (listHash, property) {
	var keys = Object.keys(listHash);
	var sortedKeys = keys.sort(function (a, b) {
		var valA, valB;
		// Construct the comparator value by concatinating property values if the properties were passed as an array

			// This will accept a single property in the form of a string
		valA = listHash[a][property];
		valB = listHash[b][property];

		// If the properties are strings, ignore the case
		if (typeof valA == "string") { valA = valA.toUpperCase(); }
		if (typeof valB == "string") { valB = valB.toUpperCase(); }

		if (valA < valB) { return -1; }
		if (valA > valB) { return 1; }
		return 0;
	});
	var newArray = [];

	sortedKeys.forEach(function(key) {
		newArray.push(listHash[key]);
	});
	return newArray;
};

// Will test if an object exists in an array by the specified properties
_array_contains_by_properties = function(array, properties, object) {
	if ( !(array) || !(properties) || !(object)) {
		return false;
	}

	// Loop over the array
	for (var i = 0; i < array.length; i++) {
		slotVal = array[i];
		propertiesMatched = true;

		properties.forEach(function(property) {
			if (slotVal[property] != object[property]) {
				propertiesMatched = false;
			}
		});

		if (propertiesMatched) {
			return true;
		}
	}
	return false;
};