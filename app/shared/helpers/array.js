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