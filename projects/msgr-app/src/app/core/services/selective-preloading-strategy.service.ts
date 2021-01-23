import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';

import { LoggerService } from './logger.service';
import { WindowService } from '@msgr/core/services/window.service';

@Injectable({
  providedIn: 'root',
})
export class SelectivePreloadingStrategyService implements PreloadingStrategy {
  private avoidConnections = ['slow-2g', '2g'];

  constructor(private windowService: WindowService, private logger: LoggerService) {}

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data?.preload && this.hasGoodConnection()) {
      this.logger.log(`Preloaded: ${route.path}`);
      return load();
    }

    return EMPTY;
  }

  private hasGoodConnection(): boolean {
    const connection = (this.windowService.navigator as any).connection;

    if (!connection) return true; // if not supported, pass on

    return !(connection.saveData || this.avoidConnections.includes(connection.effectiveType || ''));
  }
}
