import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggerService } from '@msgr/core/services/logger.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const logger = this.injector.get<LoggerService>(LoggerService);

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      // if (!navigator.onLine) {
      //   // Handle offline error
      //
      // } else {
      //   // Handle Http Error (error.status === 403, 404...)
      //   // todo: log uncaught server error
      //
      // }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      // todo: log uncaught client error
    }

    // show uncaught error to user
    // notificationService.showError(error.message);

    // Log the error to the console anyway
    logger.error(error);
  }
}
