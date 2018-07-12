import { SchedulingState } from "@scheduling/models/scheduling.model";

const initialState: SchedulingState = {
  name: 'New Scheduling View',
  showName: false,
  courses: {
    loading: false,
    list: []
  }
}

export function schedulingReducer(state: SchedulingState = initialState, action) {
  switch(action.type) {
    case 'TOGGLE_MESSAGE':
      return {
        ...state,
        showName: !state.showName
      };
    case 'GET_COURSES':
      return {
        ...state,
        courses: {
          loading: true,
          list: state.courses.list
        }
      };
    case 'GET_COURSES_SUCCESS':
      return {
        ...state,
        courses: {
          loading: false,
          list: action.payload
        }
      };
    default:
      return state;
  }
}