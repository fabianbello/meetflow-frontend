import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  // REGISTRAR USUARIO
  register() {
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);
    //this.router.navigateByUrl('/dashboard');

    const { email, password, name } = this.miFormulario.value;
    let nameSplit = name.split(' ');
    let firstName = nameSplit[0][0].toUpperCase();
    let secondName = ' ';
    let thirdName = ' ';
    if (nameSplit.length > 1) {
      secondName = nameSplit[1][0].toUpperCase();
    }
    if (nameSplit.length > 2) {
      thirdName = nameSplit[2][0].toUpperCase();
    }


    let tagName = firstName + '' + secondName + '' + thirdName;

    this.authService.registro(name, tagName, email, password).subscribe((resp) => {
/*       this.router.navigateByUrl('/auth/signin'); */
      console.log(resp);
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
        title: 'Se ha registrado exitosamente.'
      })

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
    },
      (err) => {
        console.log('ERROR', err.error.error.message);
        if (err.error.error.error === 'Bad Request') {
          this.miFormulario.markAllAsTouched();

          /* this.isError = true; */

          Swal.fire(
            'Revisar campos',
            err.error.error.message[0] +
            ', ' +
            err.error.error.message[1],

            'error'
          );
        }
        else if (err.error.error.message === 'Timeout has occurred') {
          Swal.fire('ERROR', 'Microservicio de Usuarios no responde. (Peticiones se cargaran una vez vuelva a estar en funcionamiento)', 'error');
        }

        else {
          this.miFormulario.markAllAsTouched();
          Swal.fire('ERROR', err.error.error.message, 'error');
        }
      }

    );
  }
  campoEsValido(campo: string) {
    if (campo === 'error') {
      console.log("ERROR AQUI!!!")
      return true;

    } else {
      return (
        this.miFormulario.controls[campo].errors &&
        this.miFormulario.controls[campo].touched
      );
    }
  }
}
