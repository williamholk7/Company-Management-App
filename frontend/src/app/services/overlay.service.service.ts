import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class OverlayServiceService {
  private overlayVisibility = new BehaviorSubject<boolean>(false);
  overlayVisibility$ = this.overlayVisibility.asObservable();

  showOverlay() {
    this.overlayVisibility.next(true);
  }

  hideOverlay() {
    this.overlayVisibility.next(false);
  }
}
