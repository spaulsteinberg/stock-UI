import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendsPanelComponent } from './dividends-panel.component';

describe('DividendsPanelComponent', () => {
  let component: DividendsPanelComponent;
  let fixture: ComponentFixture<DividendsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividendsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividendsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
