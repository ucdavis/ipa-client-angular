import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiRoot = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getCourses(url): any {
		const jwtToken = localStorage.getItem('JWT');
    let options: any = {
      withCredentials: true
    };

    this.http
      .get(this.apiRoot + url, options)
      .subscribe(res => console.log(res));
  }
}
