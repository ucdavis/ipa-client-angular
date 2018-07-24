import { Injectable, ErrorHandler } from '@angular/core';
import { ApiService } from './api/api.service';

@Injectable({ providedIn: 'root' })
export class ExceptionHandler implements ErrorHandler {
  private errors = [];

  constructor(private apiService: ApiService) {}

  handleError(error) {
    this.errors.push(error);

    if (this.errors.length < 2) {
      let exceptionObject = {
        message: error.message,
        stack: error.stack,
        url: window.location.href
      };

      this.apiService
        .post('/api/reportJsException', exceptionObject)
        .subscribe();
    }

    // does properly replicate default Angular error handling behavior, but unsure if this is the proper way to do it.
    new ErrorHandler().handleError(error);
  }
}
