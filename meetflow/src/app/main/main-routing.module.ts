import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMeetingComponent } from '../meeting/add-meeting/add-meeting.component';
import { MeetingComponent } from '../meeting/meeting.component';
import { AddProjectComponent } from '../project/add-project/add-project.component';
import { EditProjectComponent } from '../project/edit-project/edit-project.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
    path: '',component: MenuComponent,
    children: [
      { path: 'add-project', component: AddProjectComponent},
      { path: ':id/edit-project', component: EditProjectComponent},
      { path: ':id/add-meeting', component: AddMeetingComponent},
      { path: ':idP/meeting/:idM', component: MeetingComponent},
      { path: '**', redirectTo: ''},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
