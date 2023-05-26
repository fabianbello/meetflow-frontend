import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
    *{
      margin: 15px;
     background-color: rgb(240, 240, 240); 
    }
    `
  ]
})
export class MenuComponent implements OnInit {

  get usuario(){
    return this.authService.usuario;
  }

  constructor( private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout(){
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }

}
