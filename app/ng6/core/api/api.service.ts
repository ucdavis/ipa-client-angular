import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // 'apiUrl' value is injected via webpack
  private apiUrl: string = process.env.API_URL;

  constructor(private http: HttpClient) {}

  get(url): Observable<any> {
    return this.http.get(this.apiUrl + url, { withCredentials: true });
  }

  post(url, data): Observable<any> {
    return this.http.post(this.apiUrl + url, data);
  }

  delete(url): Observable<any> {
    return this.http.delete(this.apiUrl + url, { withCredentials: true });
  }
}
