import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workgroup } from '../models/workgroup.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkgroupService {
  private apiUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) {
    this.fetchWorkgroups();
  }

  private _workgroups: BehaviorSubject<Workgroup[]> = new BehaviorSubject([]);
  public readonly workgroups$: Observable<Workgroup[]> = this._workgroups.asObservable();

  getWorkgroups(): Observable<Workgroup[]> {
    return this.workgroups$;
  }

  updateWorkgroup(workgroup): void {
    let options: any = {
      withCredentials: true
    };

    this.http.put(this.apiUrl + "/api/adminView/workgroups/" + workgroup.id, workgroup, options).subscribe( (newWorkgroup: any) => {
      let workgroups = this._workgroups.getValue().map(function(slotWorkgroup) { return newWorkgroup.id == slotWorkgroup.id ? newWorkgroup : slotWorkgroup; });
      this._workgroups.next(workgroups);
    });
  }

  fetchWorkgroups(): any {
    let options: any = {
      withCredentials: true
    };

    this.http.get(this.apiUrl + "/api/adminView", options).subscribe( (data: any) => {
      let lastAccessHash = {};

      // Deserialize lastActiveDates
      data.lastActiveDates.forEach(jsonLastActive => {
        let explodedLastActive = jsonLastActive.split(",");
        let workgroupId = explodedLastActive[0];
        let date = explodedLastActive[1].split(" ")[0];
        date = date != "null" ? date : ""; 
        lastAccessHash[workgroupId] = date;
      });

      // Attach lastActiveDate
      let workgroups = data.workgroups.map(workgroup => {
        workgroup.lastAccessed = lastAccessHash[workgroup.id];
        return workgroup;
      });

      this._workgroups.next(workgroups);
    });
  }
}
