import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { AddMeetingComponent } from '../meeting/add-meeting/add-meeting.component';
import { MeetingComponent } from '../meeting/meeting.component';
import { AddProjectComponent } from '../project/add-project/add-project.component';
import { EditProjectComponent } from '../project/edit-project/edit-project.component';
import { MenuComponent } from './menu/menu.component';
import { PreMeetingComponent } from '../meeting/pre-meeting/pre-meeting.component';
import { InMeetingComponent } from '../meeting/in-meeting/in-meeting.component';
import { PostMeetingComponent } from '../meeting/post-meeting/post-meeting.component';
import { UserComponent } from '../user/user.component';
import { TaskComponent } from '../task/task.component';
import { RememberComponent } from '../remember/remember.component';
import { SidebarTasksComponent } from '../shared/sidebar-tasks/sidebar-tasks.component';
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
  {
    path: '',component: MenuComponent,
    children: [
      { path: 'add-project', component: AddProjectComponent},
      { path: ':id/edit-project', component: EditProjectComponent},
      { path: ':id/add-meeting', component: AddMeetingComponent},
      { path: ':idP/meeting/:idM', component: MeetingComponent},
      { path: 'loading', component: LoadingComponent},
      {path: ':idP/meeting/:idM/in-meeting', component: InMeetingComponent},
      {path: ':idP/meeting/:idM/pre-meeting', component: PreMeetingComponent},
      {path: ':idP/meeting/:idM/post-meeting', component: PostMeetingComponent},
      { path: 'user-edit', component: UserComponent},
      { path: 'task', component: TaskComponent},
      { path: 'remember', component: RememberComponent},
      {path: 'admin', component: LoadingComponent},
      {path: 'home', component: HomeComponent},
      { path: '**', redirectTo: 'home'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }