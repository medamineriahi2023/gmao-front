import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      username: 'jean.dupont',
      role: 'maintenance_chief'
    },
    {
      id: 2,
      firstName: 'Pierre',
      lastName: 'Martin',
      email: 'pierre.martin@example.com',
      username: 'pierre.martin',
      role: 'technician'
    },
    {
      id: 3,
      firstName: 'Marie',
      lastName: 'Laurent',
      email: 'marie.laurent@example.com',
      username: 'marie.laurent',
      role: 'technician'
    }
  ];

  constructor(private router: Router) {
    // Simuler un utilisateur connecté
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    } else {
      this.currentUserSubject.next(this.users[0]);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    const user = this.users.find(u => u.username === username);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(true);
    }
    return of(false);
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getTechnicians(): Observable<User[]> {
    return of(this.users.filter(user => user.role === 'technician'));
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.users.find(user => user.id === id));
  }

  isMaintenanceChief(): boolean {
    return this.currentUserSubject.value?.role === 'maintenance_chief';
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get fullName(): string {
    const user = this.currentUserSubject.value;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }
}