import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionDialogComponent } from './position-dialog.component';

describe('PositionDialogComponent', () => {
  let component: PositionDialogComponent;
  let fixture: ComponentFixture<PositionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
