/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LightComponent } from './light.component';

describe('LightComponent', () => {
  let component: LightComponent;
  let fixture: ComponentFixture<LightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
