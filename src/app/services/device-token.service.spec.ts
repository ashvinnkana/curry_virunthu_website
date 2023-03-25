import { TestBed } from '@angular/core/testing';

import { DeviceTokenService } from './device-token.service';

describe('DeviceTokenService', () => {
  let service: DeviceTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
