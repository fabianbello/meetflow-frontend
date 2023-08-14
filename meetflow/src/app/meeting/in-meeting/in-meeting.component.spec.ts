import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InMeetingComponent } from './in-meeting.component';

describe('InMeetingComponent', () => {
  let component: InMeetingComponent;
  let fixture: ComponentFixture<InMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
