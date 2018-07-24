import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  post(url, data, options?): any {
    return this.http.post(this.apiUrl + url, data);
  }

  delete(url): any {
    let options: any = {
      withCredentials: true
    };

    return this.http.delete(this.apiUrl + url, options);
  }
}
