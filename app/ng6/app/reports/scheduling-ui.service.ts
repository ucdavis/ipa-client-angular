// import { Observable, BehaviorSubject } from 'rxjs';

// interface uiState {
//   activeTab: string;
// }

// export class SchedulingUIService {
//   private uiState: BehaviorSubject<uiState> = new BehaviorSubject({
//     activeTab: 'summary'
//   });

//   getState(): Observable<uiState> {
//     return this.uiState.asObservable();
//   }

//   setState(key, payload) {
//     let state = this.uiState.value;
//     state = {
//       ...state,
//       [key]: payload
//     };

//     this.uiState.next(state);
//   }
// }
