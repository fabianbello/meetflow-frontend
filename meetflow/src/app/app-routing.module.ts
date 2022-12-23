import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./main/main.module').then((m) => m.MainModule),
      /* canActivate: [ValidarTokenGuard],
      canLoad: [ValidarTokenGuard], */
  },
  {
    path: 'project',
    loadChildren: () =>
      import('./project/project.module').then((m) => m.ProjectModule),
      /* canActivate: [ValidarTokenGuard],
      canLoad: [ValidarTokenGuard], */
  },
  {
    path: 'meeting',
    loadChildren: () =>
      import('./meeting/meeting.module').then((m) => m.MeetingModule),
      /* canActivate: [ValidarTokenGuard],
      canLoad: [ValidarTokenGuard], */
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
