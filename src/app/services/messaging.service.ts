import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messages: Message[] = [];
  private messagesSubject = new BehaviorSubject<Message[]>([]);

  constructor(private authService: AuthService) {}

  sendMessage(receiverId: string, content: string): Observable<Message> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const message: Message = {
      id: Date.now(),
      senderId: currentUser.username,
      receiverId,
      content,
      timestamp: new Date(),
      read: false
    };

    this.messages.push(message);
    this.messagesSubject.next(this.messages);
    return new Observable(observer => observer.next(message));
  }

  getMessagesBetweenUsers(otherUserId: string): Observable<Message[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    return this.messagesSubject.pipe(
      map(messages => messages.filter(msg => 
        (msg.senderId === currentUser.username && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === currentUser.username)
      ))
    );
  }

  markAsRead(messageId: number): void {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
      this.messagesSubject.next(this.messages);
    }
  }

  getUnreadCount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return new Observable(observer => observer.next(0));

    return this.messagesSubject.pipe(
      map(messages => messages.filter(msg => 
        msg.receiverId === currentUser.username && !msg.read
      ).length)
    );
  }
}