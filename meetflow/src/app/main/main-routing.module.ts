import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from '../project/add-project/add-project.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
    path: '',component: MenuComponent,
    children: [
      { path: 'add-project', component: AddProjectComponent},
      { path: '**', redirectTo: ''},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
