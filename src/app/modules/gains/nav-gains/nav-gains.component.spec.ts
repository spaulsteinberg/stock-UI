import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavGainsComponent } from './nav-gains.component';

describe('NavGainsComponent', () => {
  let component: NavGainsComponent;
  let fixture: ComponentFixture<NavGainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavGainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavGainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
