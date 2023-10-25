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

  // Variable de manejador de error
  isError = false;

  // Formulario de login
  loginForm!: FormGroup;

  // Instanciación de la clase LoginComponent
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Definición de formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Inicializacion del componente de login
  ngOnInit(): void { }

  /* 
  Metodo de ingresar un usuario a la plataforma
  Entrada: Datos de campos email y password
  Salida: Usuario validado o invalidado
  */
  async login() {
    const { email, password } = this.loginForm.value;
    // Comprobación de datos ingresados en campos
    console.log(email);
    console.log(password);
    this.authService.login(email, password).subscribe(
      async (resp) => {
        console.log(resp);
        // En caso de existir respuesta de validación del usuario,
        // se solicita al servicio asignar token 
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
        // redirigiar al usuario al menu principal
        this.router.navigate(['/main']).then(() => {
          window.location.reload();
        });
      },
      // Manejador de errores
      (err) => {
        console.log('ERROR', err.error.error.message);
        if (err.error.error.error === 'Bad Request') {
          this.isError = true;
          this.loginForm.markAllAsTouched();
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
  }

  /*
  Metodo que valida los campos del formulario de login
  Entrada: campo a evaluar
  Salida: boolean en caso de existir error 
  */
  campoEsValido(campo: string) {
    // En caso de existir error
    if (campo === 'error') {
      return true;
    } else {
      return (
        this.loginForm.controls[campo].errors &&
        this.loginForm.controls[campo].touched
      );
    }
  }
  requestResetPass(){
    Swal.fire({
      title: 'Enviar una nueva contraseña al correo electronico',
      text: '¿Cual es tu email registrado?',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Enviar nueva contraseña',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      /*       denyButtonText: `Avanzado`, */
      preConfirm: (email) => {
        console.log("[CONTROLLER LOGIN: REQUEST_RESET_PASS] CAPTURADO EL MODAL email ",email);
        this.resetPass(email);
      
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {
   
      }
    });
  }


  resetPass(email: string){
    console.log("[CONTROLLER LOGIN: RESET_PASS] Email: ", email);
    this.authService.resetPass(email).subscribe(
      async (resp) => {
        console.log("[CONTROLLER LOGIN: RESET_PASS] respuesta de solicitud = ",resp);
      
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

      },
      // Manejador de errores
      (err) => {
        if (err.error.error.error === 'Bad Request') {
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
  }

}
