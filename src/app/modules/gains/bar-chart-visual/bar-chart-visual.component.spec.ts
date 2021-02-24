import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartVisualComponent } from './bar-chart-visual.component';

describe('BarChartVisualComponent', () => {
  let component: BarChartVisualComponent;
  let fixture: ComponentFixture<BarChartVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
