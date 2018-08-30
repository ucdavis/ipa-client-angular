import { Injectable } from '@angular/core';
import { SharedState } from '@core/shared-state/shared-state.model';

@Injectable({ providedIn: 'root' })
export class SharedStateService {
  getSharedState(): SharedState {
    return {
      workgroupId: parseInt(localStorage.getItem('workgroupId')),
      year: parseInt(localStorage.getItem('year')),
      JWT: localStorage.getItem('JWT'),
      userRoles: JSON.parse(localStorage.getItem('userRoles')),
      termStates: JSON.parse(localStorage.getItem('termStates')),
      displayName: localStorage.getItem('displayName'),
      loginId: localStorage.getItem('loginId')  
    };
  }

  setSharedState(data: any): void {
    localStorage.setItem('workgroupId', data.workgroupId);
    localStorage.setItem('year', data.year);
    localStorage.setItem('JWT', data.token);
    localStorage.setItem('userRoles', JSON.stringify(data.userRoles));
    localStorage.setItem('termStates', JSON.stringify(data.termStates));
    localStorage.setItem('displayName', data.displayName);
    localStorage.setItem('loginId', data.loginId);
  }

  purgeSharedState(): void {
    localStorage.removeItem('JWT');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('displayName');
    localStorage.removeItem('termStates');
  }

  setJWT(jwt: string): void {
    localStorage.setItem('JWT', jwt);
  }
}
