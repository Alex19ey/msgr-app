import { Injectable } from '@angular/core';
import { environment } from '@msgr-env/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(value: unknown, ...args: unknown[]) {
    if (!environment.production) {
      console.log(value, ...args);
    }
  }

  error(error: Error) {
    console.error(error);
  }

  warn(value: unknown, ...rest: unknown[]) {
    console.warn(value, ...rest);
  }
}
