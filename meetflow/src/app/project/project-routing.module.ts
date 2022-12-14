import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './add-project/add-project.component';

const routes: Routes = [
  {
    path: '',
    children: [
    { path: 'add2-project', component: AddProjectComponent},
    { path: '**', redirectTo: 'basicos'}
  ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
