import { TestBed, async, inject } from '@angular/core/testing';

import { EleveGuard } from './eleve.guard';

describe('EleveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EleveGuard]
    });
  });

  it('should ...', inject([EleveGuard], (guard: EleveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
