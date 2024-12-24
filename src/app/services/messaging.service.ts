import { Injectable } from '@angular/core';
    import { BehaviorSubject, Observable } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class MessagingService {
      private unreadMessagesCountSubject = new BehaviorSubject<number>(2);

      getUnreadMessagesCount(): Observable<number> {
        return this.unreadMessagesCountSubject.asObservable();
      }

      updateUnreadMessagesCount(count: number) {
        this.unreadMessagesCountSubject.next(count);
      }
    }
