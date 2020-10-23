import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsDisplayComponent } from './earnings-display.component';

describe('EarningsDisplayComponent', () => {
  let component: EarningsDisplayComponent;
  let fixture: ComponentFixture<EarningsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
