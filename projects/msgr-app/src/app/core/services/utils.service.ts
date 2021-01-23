import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SortDirection } from '@msgr/core/models';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  // use `uuid` lib if needed
  getUUID = (): UUID => `uid_${this.roundNumber(Math.random(), 7)}_${Date.now()}`;

  getElementPositionInDocument(
    el: HTMLElement
  ): { top: number; left: number; height: number; width: number } {
    const box = el.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      height: el.offsetHeight,
      width: el.offsetWidth,
    };
  }

  readFileAsText(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = (e) => {
        observer.next(<string>reader.result);
      };

      reader.onloadend = (e) => {
        observer.complete();
      };
    });
  }

  readFileAsArrayBuffer(file: File): Observable<ArrayBuffer> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.readAsArrayBuffer(file);

      reader.onload = (e) => {
        observer.next(reader.result as ArrayBuffer);
      };

      reader.onloadend = (e) => {
        observer.complete();
      };
    });
  }

  // encode to Base64
  readFileAsDataUrl(file: ArrayBuffer | Uint8Array): Observable<Base64> {
    return new Observable((observer) => {
      const reader = new FileReader();
      const blob = new Blob([file]);

      reader.readAsDataURL(blob);

      reader.onload = (e) => {
        observer.next(<string>reader.result);
      };

      reader.onloadend = (e) => {
        observer.complete();
      };
    });
  }

  getImageSize(
    imageSrc: string
  ): Observable<{ width: number; height: number; aspectRatio: number }> {
    return new Observable((observer) => {
      // let objectURL;

      const img = document.createElement('img');

      if (typeof imageSrc === 'string') {
        img.src = imageSrc;
      } else {
        // todo: do not forget to revokeObjectURL in this case
        // objectURL = URL.createObjectURL(image);
        // img.src = objectURL;
      }

      img.onload = () => {
        observer.next({
          width: img.width,
          height: img.height,
          aspectRatio: this.roundNumber((img.height / img.width) * 100, 1),
        });
        observer.complete();
      };

      img.onerror = function () {
        observer.error('Error during image download');
      };

      // return () => {
      //   if (objectURL) { URL.revokeObjectURL(objectURL); }
      // };
    });
  }

  roundNumber(number: number, precision = 0): number {
    // todo: check on max precision
    return Math.round(number * 10 ** precision) / 10 ** precision;
  }

  translateIntoPercent(current: number, max: number, precision?: number): number {
    const res = (current / max) * 100;
    return precision === undefined ? res : this.roundNumber(res, precision);
  }

  compareNumbers(a: number, b: number, sortDirection = SortDirection.Asc): number {
    return sortDirection === SortDirection.Asc ? a - b : b - a;
  }

  compareStrings(a: string, b: string, sortDirection = SortDirection.Asc): number {
    return sortDirection === SortDirection.Asc ? a.localeCompare(b) : b.localeCompare(a);
  }
}
