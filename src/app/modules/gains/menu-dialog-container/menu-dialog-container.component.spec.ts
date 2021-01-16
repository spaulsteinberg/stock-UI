import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDialogContainerComponent } from './menu-dialog-container.component';

describe('MenuDialogContainerComponent', () => {
  let component: MenuDialogContainerComponent;
  let fixture: ComponentFixture<MenuDialogContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDialogContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDialogContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
