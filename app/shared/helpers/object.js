/**
 * Searches the specified properties of the passed collection
 * the collection needs to have the state service structure:
 *
 * collection = {
 * 		ids: [1,2,3],
 * 		list: { 1: {}, 2: {}, 3: {},}
 * }
 *
 * modifies the passed collection adding 'isFiltered' flag to the
 * items that don't match all the query terms
 */
export function _object_search_properties(query, tree, propertyKeyList) {
	if (!tree.ids || !tree.list) { return; }

	// Convert the query into an array split at the white space
	var queryList = query.toLowerCase().split(/\s+/);

	tree.ids.forEach(function (itemId) {
		tree.list[itemId].isFiltered = true;

		// Create an array of the properties values
		var propertyValueList = Object.keys(tree.list[itemId])
			.filter(function (key) { return propertyKeyList.indexOf(key) >= 0; })
			.map(function (key) {
								return tree.list[itemId][key] ? tree.list[itemId][key].toLowerCase() : "";
			});

		// Find out if all the query words have a match in the properties values array
		var itemMatchesQuery = queryList.every(function (queryItem) {
			return propertyValueList.some(function (prop) { return prop.search(queryItem) >= 0; });
		});

		if (itemMatchesQuery) { tree.list[itemId].isFiltered = false; }
	});
}
