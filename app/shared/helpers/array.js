// TODO: Rename to _array_getElementById
export function _array_findById(arr, id) {
	var index = _array_getIndexById(arr, id);

	if (index == -1) {
		return undefined;
	}

	return arr[index];
}

function _array_getIndexById(arr, id) {
	if (!(arr instanceof Array)) { return -1; }
	return arr.findIndex(function (n) {
		return n.id == id;
	});
}

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
export function _array_sortIdsByProperty(listHash, properties) {
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
}

export function _array_sortByProperty(listHash, properties, reverseOrder) {
	var keys = Object.keys(listHash);
	var sortedKeys = keys.sort(function (a, b) {
		var valA, valB;

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

		if (reverseOrder) {
			if (valA < valB) { return 1; }
			if (valA > valB) { return -1; }
		} else {
			if (valA < valB) { return -1; }
			if (valA > valB) { return 1; }
		}
		return 0;
	});
	var newArray = [];

	sortedKeys.forEach(function(key) {
		newArray.push(listHash[key]);
	});
	
	return newArray;
}

// Will test if an object exists in an array by the specified properties
export function _array_contains_by_properties(array, properties, object) {
	if ( !(array) || !(properties) || !(object)) {
		return false;
	}

	// Loop over the array
	for (var i = 0; i < array.length; i++) {
		let slotVal = array[i];
		let propertiesMatched = true;

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
}

// Will return a matching object by specified properties, otherwise null
export function _array_find_by_properties(array, properties, object) {
	if ( !(array) || !(properties) || !(object)) {
		return null;
	}

	// Loop over the array
	for (var i = 0; i < array.length; i++) {
		let slotVal = array[i];
		let propertiesMatched = true;

		properties.forEach(function(property) {
			if (slotVal[property] != object[property]) {
				propertiesMatched = false;
			}
		});

		if (propertiesMatched) {
			return slotVal;
		}
	}
	return null;
}

export function _array_swap_positions(array, indexA, indexB) {
	var valA = array[indexA];
	array[indexA] = array[indexB];
	array[indexB] = valA;

	return array;
}
