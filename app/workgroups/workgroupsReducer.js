var INITIAL_STATE = {
	activeTab: "waffle",
	tags: [
		{
			id: 1,
			name: "undergrad"
		},
		{
			id: 2,
			name: "core"
		},
		{
			id: 3,
			name: "graduate"
		}
	]
};

var workgroupReducers = {};

workgroupReducers.apples = function (state, action) {
	if (!state) {
		state = INITIAL_STATE;
	}

	if (!action || !action.type) {
		return state;
	}

	switch (action.type) {
		case "ADD_TAG":
			state.tags.push(tag);
			return state;
		case "REMOVE_TAG":
			var tagIndex = _array_getIndexById(state.tags, action.payload.tag.id);
			state.tags.splice(tagIndex,1);
			return state;
		case "UPDATE_TAG":
			var tagIndex = _array_getIndexById(state.tags, action.payload.tag.id);
			state.tags[tagIndex] = action.payload.tag;
			return state;
		default:
			return state;
	}
}

workgroupReducers.bananas = function (state, action) {
	if (!state) {
		state = INITIAL_STATE;
	}

	if (!action || !action.type) {
		return state;
	}

	switch (action.type) {
		case "ADD_TAG":
			state.tags.push(tag);
			return state;
		case "REMOVE_TAG":
			var tagIndex = _array_getIndexById(state.tags, action.payload.tag.id);
			state.tags.splice(tagIndex,1);
			return state;
		case "UPDATE_TAG":
			var tagIndex = _array_getIndexById(state.tags, action.payload.tag.id);
			state.tags[tagIndex] = action.payload.tag;
			return state;
		default:
			return state;
	}
}