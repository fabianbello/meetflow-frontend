import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  users: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.listUsers();

  }

  listUsers(){

    this.authService.getAllUser().subscribe(
      async (resp: any) => {
        console.log('CUAL ES EL USUARIO?', resp);
        this.users = resp;

      },
      (err: { message: string | undefined; }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );  
  }

  deleteUserQuest(user: any){


    Swal.fire({
      title: '¿Eliminar el usuario ' + user.name + '?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar usuario',
      denyButtonText: `No`,
    }).then((result) => {

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteUser(user.id);

      } else if (result.isDenied) {
      }
    })

  }

  deleteUser(idUser: string){
    this.authService.deleteUser(idUser).subscribe(
      async (resp: any) => {
        console.log('CUAL ES EL USUARIO?', resp);
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Se ha borrado el usuario exitosamente.'
        })
        this.listUsers();
      },
      (err: { message: string | undefined; }) => {
        Swal.fire('Error', err.message, 'error');
      }
    ); 
  }


}
