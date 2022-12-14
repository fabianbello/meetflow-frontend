import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/main', title: 'nombre 1 ',  icon: 'pe-7s-home', class: '' },
  { path: '/login', title: 'nombre 2',  icon: 'pe-7s-note2', class: '' },
  { path: '/main', title: 'nombre 3',  icon: 'pe-7s-plus', class: '' },
  { path: '/management/board', title: 'nombre 4',  icon: 'pe-7s-albums', class: '' },
  { path: '/list-reports', title: 'nombre 5',  icon: 'pe-7s-copy-file', class: '' },
  /* { path: '/observation', title: 'Observación',  icon: 'pe-7s-comment', class: '' }, */
  { path: '/stats', title: 'nombre 6',  icon: 'pe-7s-graph', class: '' },
  // { path: '/user', title: 'User Profile',  icon: 'pe-7s-user', class: '' },
  // { path: '/table', title: 'Table List',  icon: 'pe-7s-note2', class: '' },
  // { path: '/typography', title: 'Typography',  icon: 'pe-7s-news-paper', class: '' },
  // { path: '/icons', title: 'Icons',  icon: 'pe-7s-science', class: '' },
  // { path: '/notifications', title: 'Notifications',  icon: 'pe-7s-bell', class: '' },
  // { path: '/checking', title: 'Checking',  icon: 'pe-7s-note2', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  
  menuItems: any[] = ROUTES;
  logged = false;
  process = false;
  projects: any[] = ['', ''];

  constructor( private checkingService: AuthService) { }

  ngOnInit(): void {

    this.menuItems = ROUTES
    this.listProjectsInicial();
  }

  listProjectsInicial(){
    this.checkingService.listProjects().subscribe(
      (resp: any[]) => {
        this.projects = resp;
      },
      (err: any) => {
        console.log(err);
        this.projects = [];
      }
    );
  }

}
