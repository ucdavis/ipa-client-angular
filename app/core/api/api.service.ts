import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiRoot = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  get(url): any {
    let options: any = {
      withCredentials: true
    };

    return this.http.get(this.apiRoot + url, options);
  }
}
