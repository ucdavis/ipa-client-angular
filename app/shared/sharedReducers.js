var INITIAL_STATE = [];

var routeParamsThingy = function (state, action) {
	if (!state) {
		state = INITIAL_STATE;
	}

	if (!action || !action.type) {
		return state;
	}

	switch (action.type) {
		case "CHANGE_YEAR":
			state.year = action.payload.year;
			return state;
		case "CHANGE_WORKGROUP_CODE":
			state.workgroupCode = action.payload.workgroupCode;
			return state;
		case "CHANGE_BOTH":
			state.workgroupCode = action.payload.workgroupCode;
			state.year = action.payload.year;
			return state;
		default:
			return state;
	}
}