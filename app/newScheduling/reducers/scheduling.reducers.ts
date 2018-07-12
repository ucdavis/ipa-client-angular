import { SchedulingState } from "@app/newScheduling/models/scheduling.model";

const initialState: SchedulingState = {
  name: 'New Scheduling View',
  showName: false
}

export function schedulingReducer(state: SchedulingState = initialState, action) {
  switch(action.type) {
    case 'TOGGLE_MESSAGE':
      return {
        ...state,
        showName: !state.showName
      };
      default:
        return state;
  }
}