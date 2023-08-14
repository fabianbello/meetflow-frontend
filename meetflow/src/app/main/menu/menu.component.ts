import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

const $openClose = document.getElementById('open-close');
const $aside = document.getElementById('aside');

const body = document.querySelector('body'),
  sidebar = document.querySelector('nav'),
  togle = document.querySelector('.toggle'),
  searchBtn = document.querySelector('.search-box'),
  modeSwitch = document.querySelector('.toggle-switch'),
  modeText = document.querySelector('.mode-text');


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})

export class MenuComponent implements OnInit {

  menuItems?: any[] = ['hola', 'juanito', 'perez'];

  @Input() sideNavStatus: boolean = false;
  @Input() nameProjectEmite: string = '';
  @Input() nameMeetingEmite: string = '';
  @Input() newParticipants: any = [];

  get usuario() {
    return this.authService.usuario;
  }

  constructor(
    private router: Router,
    private authService: AuthService,

  ) {

    console.log('ITEMS : ', this.menuItems);
    console.log("ESTADO DESDE EL MENU COMPONENT: ", this.sideNavStatus);
  }



  ngOnInit(): void { }




















  public onOpen() {
    console.log('open');
  }

  public onClose() {
    console.log('close');
  }

  public onChangeVisibility(event: any) {
    console.log('change visibility', event);
  }



  /*   opened = false;

  toggleSidebar() {
     this.opened = !this.opened;
   } */

  logout() {
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }




}
