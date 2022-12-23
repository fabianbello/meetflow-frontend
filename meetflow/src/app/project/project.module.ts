import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from '../main/main-routing.module';


@NgModule({
  declarations: [
    AddProjectComponent,
    EditProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    MainRoutingModule,
    FormsModule,
    SharedModule
  
  ]
})
export class ProjectModule { }
