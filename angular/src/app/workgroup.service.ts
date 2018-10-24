import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WorkgroupService {
  private apiUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  getWorkgroups(): any {
    let options: any = {
      withCredentials: true
    };

    return this.http.get(this.apiUrl + "/api/workgroups", options);
  }
}
