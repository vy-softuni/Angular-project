import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '@project/src/app/core/services/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('reflects logged-in state from token', () => {
    expect(service.isLoggedIn).toBe(false);
    localStorage.setItem('tm_token', 'abc');
    // new instance to pick up existing token is not necessary for getter, but ensure behavior
    expect(service.isLoggedIn).toBe(true);
  });

  it('login persists user and token', () => {
    service.login('a@b.c', 'secret').subscribe(res => {
      expect(res.token).toBe('tkn');
      expect(res.user.email).toBe('a@b.c');
      expect(localStorage.getItem('tm_token')).toBe('tkn');
      const u = JSON.parse(localStorage.getItem('tm_user') || 'null');
      expect(u.email).toBe('a@b.c');
    });

    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'tkn', user: { _id: '1', email: 'a@b.c', displayName: 'A', role: 'user', avatarUrl: '' } });
  });

  it('logout clears storage', () => {
    localStorage.setItem('tm_token', 't');
    localStorage.setItem('tm_user', JSON.stringify({ email: 'x' }));
    service.logout();
    expect(localStorage.getItem('tm_token')).toBeNull();
    expect(localStorage.getItem('tm_user')).toBeNull();
  });
});