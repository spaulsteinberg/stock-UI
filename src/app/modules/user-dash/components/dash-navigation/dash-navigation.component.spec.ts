import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashNavigationComponent } from './dash-navigation.component';

describe('DashNavigationComponent', () => {
  let component: DashNavigationComponent;
  let fixture: ComponentFixture<DashNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
