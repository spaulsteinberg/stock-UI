import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartVisualComponent } from './pie-chart-visual.component';

describe('PieChartVisualComponent', () => {
  let component: PieChartVisualComponent;
  let fixture: ComponentFixture<PieChartVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
