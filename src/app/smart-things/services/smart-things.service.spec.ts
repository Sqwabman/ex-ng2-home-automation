/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmartThingsService } from './smart-things.service';

describe('SmartThingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartThingsService]
    });
  });

  it('should ...', inject([SmartThingsService], (service: SmartThingsService) => {
    expect(service).toBeTruthy();
  }));
});
