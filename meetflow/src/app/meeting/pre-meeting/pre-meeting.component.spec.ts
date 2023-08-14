import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreMeetingComponent } from './pre-meeting.component';

describe('PreMeetingComponent', () => {
  let component: PreMeetingComponent;
  let fixture: ComponentFixture<PreMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
