import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule } from '../main/main-routing.module';
import { MeetingMinuteComponent } from './meeting-minute.component';
import { TopicModule } from '../topic/topic.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AltSidebarModule } from 'ng-alt-sidebar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AltSidebarModule,
    ReactiveFormsModule,
    MainRoutingModule,
    DragDropModule
  ],
  exports: [],
  providers:[]
})
export class MeetingMinuteModule { }
