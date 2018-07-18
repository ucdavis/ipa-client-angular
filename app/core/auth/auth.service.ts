import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiRoot = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  validateToken(): Observable<any> {
    var token = localStorage.getItem('JWT');

    console.log('POST with token:  ' + token);
    return this.http
      .post(
        this.apiRoot + '/login',
        { token: token },
        { withCredentials: true }
      );
    // .subscribe((res) => {
    //    console.log(res);
    //  });
  }
}
