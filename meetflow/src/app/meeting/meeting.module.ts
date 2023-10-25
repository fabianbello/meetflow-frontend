import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingComponent } from './meeting.component';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule } from '../main/main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PreMeetingComponent } from './pre-meeting/pre-meeting.component';
import { TopicComponent } from '../topic/topic.component';
import { InMeetingComponent } from './in-meeting/in-meeting.component';
import { PostMeetingComponent } from './post-meeting/post-meeting.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MeetingMinuteComponent } from '../meeting-minute/meeting-minute.component';



@NgModule({
  declarations: [
    MeetingComponent,
    AddMeetingComponent,
    PreMeetingComponent,
    InMeetingComponent,
    PostMeetingComponent,
    MeetingMinuteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainRoutingModule,
    FormsModule,
    SharedModule,
    DragDropModule
  ]
})
export class MeetingModule { }
