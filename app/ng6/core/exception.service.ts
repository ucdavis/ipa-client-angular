import { Injectable, ErrorHandler } from '@angular/core';
import { ApiService } from '@core/api/api.service';

@Injectable({ providedIn: 'root' })
export class ExceptionHandler extends ErrorHandler {
  private errors = [];

  constructor(private apiService: ApiService) {
    super();
  }

  handleError(error) {
    // Make sure an error is sent only once
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

    // Delegate to the default handler
    super.handleError(error);
  }
}
