import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: any;

  constructor(private router: Router, private authService: AuthService) { 
    this.authService.userLogin().subscribe(
      async (resp) => {
        console.log("CUAL ES EL USUARIO?", resp);
        this.user = resp;

      },
      (err) => {
        Swal.fire('Error', err.message, 'error');
      }
      );
  }

  ngOnInit(): void {
    


  }
  

  logoutUser(){
    localStorage.removeItem('token');
/*     this.logged = false; */
    this.router.navigate(['/dashboard'])
    
    .then(() => {
      window.location.reload();
    });
  }

}
