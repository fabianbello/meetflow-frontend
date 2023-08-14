import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingComponent } from './meeting.component';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule } from '../main/main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PreMeetingComponent } from './pre-meeting/pre-meeting.component';
import { MeetingMinuteComponent } from '../meeting-minute/meeting-minute.component';
import { MeetingMinuteModule } from '../meeting-minute/meeting-minute.module';
import { TopicComponent } from '../topic/topic.component';
import { InMeetingComponent } from './in-meeting/in-meeting.component';
import { PostMeetingComponent } from './post-meeting/post-meeting.component';



@NgModule({
  declarations: [
    MeetingComponent,
    AddMeetingComponent,
    PreMeetingComponent,
    MeetingMinuteComponent,
    InMeetingComponent,
    PostMeetingComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainRoutingModule,
    FormsModule,
    SharedModule,
  ]
})
export class MeetingModule { }
