import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  miFormulario!: FormGroup;
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdfGNU = "https://www.ugc.edu.co/pages/juridica/documentos/institucionales/Licencia_publica_general_de_GNU.pdf";
  pdfGNUgit = "https://github.com/fabianbello/dockerMeetflow/blob/main/Licencia_publica_general_de_GNU.pdf";
  pdfGNUlocal = "file:///C:/Users/Fabi%C3%A1n/Desktop/LQRI%204%20[4%20gb]/meetflow/front/meetflow-front/src/assets/docs/Licencia_publica_general_de_GNU.pdf";
  pdfGNUgdrive = "https://drive.google.com/file/d/13L6RNnk4yY7fTLo67pXAW6IHmGbsbn5X/view?usp=drive_link";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.miFormulario = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void { }

  // REGISTRAR USUARIO
  register() {
    if (this.isAcceptContract) {
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


      if(email.split('@')[1] != "usach.cl"){
        this.authService.registro(name, tagName, email, password).subscribe((resp) => {
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
  
          this.authService.login(email, password).subscribe(
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
              Swal.fire('Verificar datos', err.error.error.message, 'warning');
            }
          }
  
        );
      }
      else if(email.split('@')[1] != "usach.cl"){

        Swal.fire(
          'Revisar',
          "Debe ingresar un correo USACH"
  
        );
      }


    } else {
      Swal.fire(
        'Revisar',
        "Debe aceptar los terminos y condiciones"

      );
    }

  }
  campoEsValido(campo: string) {
    if (campo === 'error') {
      return true;

    } else {
      return (
        this.miFormulario.controls[campo].errors &&
        this.miFormulario.controls[campo].touched
      );
    }
  }
  isAcceptContract = false;

  aceptarContrato() {
    this.isAcceptContract = true;
  }

  openScrollableContent(longContent: any, numTopic: number, type: any) {

    this.modalService.open(longContent, { scrollable: true, modalDialogClass: 'dark-modal' });


  }


}
