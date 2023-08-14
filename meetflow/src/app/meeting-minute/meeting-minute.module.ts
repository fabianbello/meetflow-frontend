import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule } from '../main/main-routing.module';
import { MeetingMinuteComponent } from './meeting-minute.component';
import { TopicModule } from '../topic/topic.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainRoutingModule,

  ],
  exports: []
})
export class MeetingMinuteModule { }
