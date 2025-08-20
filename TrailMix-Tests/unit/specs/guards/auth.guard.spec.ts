import { TestBed, runInInjectionContext } from '@angular/core/testing';
import { Router } from '@angular/router';
import { canActivateAuth } from '@project/src/app/core/guards/auth.guard';
import { AuthService } from '@project/src/app/core/services/auth.service';

describe('canActivateAuth guard', () => {
  let routerSpy: { navigateByUrl: jest.Mock };
  let authMock: Partial<AuthService>;

  beforeEach(() => {
    routerSpy = { navigateByUrl: jest.fn() };
    authMock = {
      get isLoggedIn() { return false; }
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authMock }
      ]
    });
  });

  it('redirects to /login when not logged in', () => {
    const result = runInInjectionContext(TestBed, () => canActivateAuth(null as any, null as any));
    expect(result).toBe(false);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('allows navigation when logged in', () => {
    (authMock as any).isLoggedIn = true;
    const result = runInInjectionContext(TestBed, () => canActivateAuth(null as any, null as any));
    expect(result).toBe(true);
  });
});