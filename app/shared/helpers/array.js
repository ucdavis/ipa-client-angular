_array_findById = function(arr, id) {
	for(var el in arr) {
		// hasOwnProperty ensures prototypes aren't considered
		if(arr.hasOwnProperty(el)) {
			if(arr[el].id == id) return arr[el];
		}
	}

	return undefined;
}