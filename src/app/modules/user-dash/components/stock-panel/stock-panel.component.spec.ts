import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPanelComponent } from './stock-panel.component';

describe('StockPanelComponent', () => {
  let component: StockPanelComponent;
  let fixture: ComponentFixture<StockPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
