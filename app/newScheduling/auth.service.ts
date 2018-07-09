import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiRoot = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  validateToken(token): void {
    console.log('POST with token:  ' + token);
    this.http
      .post(
        this.apiRoot + '/login',
        { token: token },
        { withCredentials: true }
      )
      .subscribe(res => console.log(res));
  }
}
