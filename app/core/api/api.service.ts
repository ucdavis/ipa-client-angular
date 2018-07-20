import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiRoot = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
//    private configService: ConfigService
  ) {
//    this.apiRoot = configService.getApiRoot();
  }

  get(url): any {
    let options: any = {
      withCredentials: true
    };

    return this.http.get(this.apiRoot + url, options);
  }

  delete(url): any {
    let options: any = {
      withCredentials: true
    };

    return this.http.delete(this.apiRoot + url, options);
  }
}
