import { Injectable } from '@angular/core';
    import { BehaviorSubject, Observable } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class NotificationService {
      private unreadNotificationsCountSubject = new BehaviorSubject<number>(2);

      getUnreadNotificationsCount(): Observable<number> {
        return this.unreadNotificationsCountSubject.asObservable();
      }

      updateUnreadNotificationsCount(count: number) {
        this.unreadNotificationsCountSubject.next(count);
      }
    }
