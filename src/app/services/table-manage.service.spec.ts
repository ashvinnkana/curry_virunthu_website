import { TestBed } from '@angular/core/testing';

import { TableManageService } from './table-manage.service';

describe('TableManageService', () => {
  let service: TableManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
