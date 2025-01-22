import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendardialogComponent } from './calendardialog.component';

describe('CalendardialogComponent', () => {
  let component: CalendardialogComponent;
  let fixture: ComponentFixture<CalendardialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalendardialogComponent]
    });
    fixture = TestBed.createComponent(CalendardialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
