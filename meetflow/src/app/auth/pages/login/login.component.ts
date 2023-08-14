import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }


  async login() {
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);

    /* this.authService.validarToken()
    .subscribe(resp=> console.log(resp)); */

    const { email, password } = this.miFormulario.value;
    console.log(email);
    console.log(password);
    this.authService.login2(email, password).subscribe(
      async (resp) => {
        console.log(resp);

        await this.authService.setToken(resp.token);

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
          title: 'Se ha ingresado exitosamente.'
        })

        this.router.navigate(['/main']).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        console.log('ERROR', err.error.error.message);
        if (err.error.error.error === 'Bad Request') {
          this.isError = true;
          this.miFormulario.markAllAsTouched();


          Swal.fire(
            'Revisar campos',
            err.error.error.message[0] + ', ' + err.error.error.message[1],
            'error'
          );
        } else if (err.error.error.message === 'Timeout has occurred') {
          Swal.fire('ERROR', 'Microservicio de Usuarios no responde.', 'error');
        } else {
          Swal.fire('ERROR', err.error.error.message, 'error');
        }
      }
    );

    /* this.router.navigateByUrl('/dashboard'); */
  }


  campoEsValido(campo: string) {
    if (campo === 'error') {
      console.log('ERROR AQUI!!!');
      return true;
    } else {
      return (
        this.miFormulario.controls[campo].errors &&
        this.miFormulario.controls[campo].touched
      );
    }
  }


}
