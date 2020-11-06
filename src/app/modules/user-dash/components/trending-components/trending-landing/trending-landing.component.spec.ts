import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingLandingComponent } from './trending-landing.component';

describe('TrendingLandingComponent', () => {
  let component: TrendingLandingComponent;
  let fixture: ComponentFixture<TrendingLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
