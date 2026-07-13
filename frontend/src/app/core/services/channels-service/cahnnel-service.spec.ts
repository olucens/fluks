import { TestBed } from '@angular/core/testing';

import { CahnnelService } from './cahnnel-service';

describe('CahnnelService', () => {
  let service: CahnnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CahnnelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
