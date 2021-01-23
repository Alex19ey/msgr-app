import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  get ref(): Window {
    return this.windowRef;
  }

  get navigator(): Navigator {
    return this.windowRef.navigator;
  }

  get localStorage(): Storage | undefined {
    return this.isLocalStorageAvailable ? this.windowRef.localStorage : undefined;
  }

  resized$ = new Observable<Event>((observer) => {
    const subscription = new Subscription();

    this.zone.runOutsideAngular(() => {
      subscription.add(
        fromEvent(this.ref, 'resize')
          .pipe(
            debounceTime(this.defaultDebounceResizeTime),
            distinctUntilChanged(),
            tap((event: Event) => {
              this.zone.run(() => {
                observer.next(event);
              });
            })
          )
          .subscribe()
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  protected readonly windowRef: Window;
  protected readonly defaultDebounceResizeTime = 500;
  private readonly isLocalStorageAvailable: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private zone: NgZone) {
    if (!isPlatformBrowser(platformId)) throw new Error('Window Is Not Implemented');
    this.windowRef = window;

    this.isLocalStorageAvailable = this.isStorageAvailable(this.ref.localStorage);

    // it will fire if localStorage changed from another browser tab
    // this.renderer.listen('window', 'storage', (event: StorageEvent) => this.changes$.next(event));
  }

  dispatchEvent(eventName: string, el?: HTMLElement): void {
    (el || this.ref).dispatchEvent(new Event(eventName));

    // add support for IE if needed
    // let resizeEvent = window.document.createEvent('UIEvents');
    // resizeEvent.initUIEvent(eventName, true, false, window, 0);
    // window.dispatchEvent(resizeEvent);
  }

  // from MDN docs
  private isStorageAvailable(storage: Storage): boolean {
    try {
      const testValue = 'test_value';

      storage.setItem(testValue, testValue);
      storage.removeItem(testValue);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
}
