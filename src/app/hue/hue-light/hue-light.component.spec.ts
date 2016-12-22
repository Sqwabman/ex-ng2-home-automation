/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HueLightComponent } from './hue-light.component';

describe('HueLightComponent', () => {
  let component: HueLightComponent;
  let fixture: ComponentFixture<HueLightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HueLightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HueLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
