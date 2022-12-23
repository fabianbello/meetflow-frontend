import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingComponent } from './meeting.component';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule } from '../main/main-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MeetingComponent,
    AddMeetingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class MeetingModule { }
