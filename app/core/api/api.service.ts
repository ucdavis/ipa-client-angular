import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // 'apiUrl' value is injected via webpack
  private apiUrl: string = process.env.API_URL;

  constructor(private http: HttpClient) {}

  get(url): any {
    let options: any = {
      withCredentials: true
    };

    return this.http.get(this.apiUrl + url, options);
  }

  delete(url): any {
    let options: any = {
      withCredentials: true
    };

    return this.http.delete(this.apiUrl + url, options);
  }
}
