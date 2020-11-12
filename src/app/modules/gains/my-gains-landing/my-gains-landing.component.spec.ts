import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGainsLandingComponent } from './my-gains-landing.component';

describe('MyGainsLandingComponent', () => {
  let component: MyGainsLandingComponent;
  let fixture: ComponentFixture<MyGainsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGainsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGainsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
