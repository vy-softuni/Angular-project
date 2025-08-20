import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HikesService } from '@project/src/app/core/services/hikes.service';
import { take } from 'rxjs/operators';

describe('HikesService', () => {
  let service: HikesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HikesService]
    });
    service = TestBed.inject(HikesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const FAKE = [
    { _id: '1', title: 'Vitosha Ring', description: 'Scenic loop', difficulty: 'moderate' },
    { _id: '2', title: 'Rila Seven Lakes', description: 'Classic route', difficulty: 'easy' },
    { _id: '3', title: 'Musala Summit', description: 'Highest peak', difficulty: 'hard' }
  ] as any[];

  it('loadAll emits and filteredHikes$ reflects query changes', (done) => {
    // Subscribe to filteredHikes$
    const results: any[] = [];
    const sub = service.filteredHikes$.subscribe(v => results.push(v));

    // Trigger loadAll
    service.loadAll().subscribe(list => {
      expect(list.length).toBe(3);
      // After initial load with empty query => all items
      expect(results.at(-1).length).toBe(3);

      // Apply search
      service.setQuery({ search: 'musala' });
      setTimeout(() => {
        expect(results.at(-1).length).toBe(1);
        expect(results.at(-1)[0].title.toLowerCase()).toContain('musala');

        // Apply difficulty filter
        service.setQuery({ search: '', difficulty: 'easy' });
        setTimeout(() => {
          expect(results.at(-1).length).toBe(1);
          expect(results.at(-1)[0].difficulty).toBe('easy');

          sub.unsubscribe();
          done();
        }, 0);
      }, 0);
    });

    const req = http.expectOne('/api/hikes');
    expect(req.request.method).toBe('GET');
    req.flush(FAKE);
  });
});