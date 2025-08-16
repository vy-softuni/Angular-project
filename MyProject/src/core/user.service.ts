import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUser } from './types/user';

const USER_KEY = '[user]';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$$ = new BehaviorSubject<IUser | undefined>(undefined);
  public user$ = this.user$$.asObservable();

  constructor(private router: Router) {
    try {
      const lsUser = localStorage.getItem(USER_KEY);
      if (lsUser) {
        this.user$$.next(JSON.parse(lsUser));
      }
    } catch (error) {
      console.log('Could not parse user from ls');
      this.user$$.next(undefined);
    }
  }
  
  get isLoggedIn(): boolean {
    return !!this.user$$.value;
  }

  get user(): IUser | undefined {
    return this.user$$.value;
  }

  login(userData: any): void {
    // Replace with actual API call to login
    const mockUser: IUser = {
      _id: 'mockUserId123',
      email: userData.email,
      accessToken: 'mockAccessToken'
    };
    
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    this.user$$.next(mockUser);
    this.router.navigate(['/home']);
  }

  register(userData: any): void {
    // Replace with actual API call to register
     const mockUser: IUser = {
      _id: 'mockUserId456',
      email: userData.email,
      accessToken: 'mockAccessToken'
    };

    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    this.user$$.next(mockUser);
    this.router.navigate(['/home']);
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
    this.user$$.next(undefined);
    this.router.navigate(['/home']);
  }
}