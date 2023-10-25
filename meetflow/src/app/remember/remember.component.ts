import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remember',
  templateUrl: './remember.component.html',
  styleUrls: ['./remember.component.css'],
})

export class RememberComponent {
  user: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.userLogin().subscribe(
      async (resp: any) => {
        console.log('CUAL ES EL USUARIO?', resp);
        this.user = resp;
        this.getUserProfile(this.user.id);
        this.getRemembers();
      },
      (err: { message: string | undefined; }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
  }
  rememberForm!: FormGroup;
  userSelected: any;
  compromisesUserSelected: any;
  remembersUserSelected: any;

  ngOnInit(): void {
    this.rememberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      institution: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  addRemember() {
    Swal.fire({
      title: 'Creación de un recordatorio',
      /*   text: 'Seleccionar un tipo de recordatorio.', */
      inputPlaceholder: 'Seleccionar un tipo de recordatorio',
      input: 'select',
      inputOptions: {
        'task': 'Para tareas',
        'meet': 'Para reuniones',
        /*   'personality': 'Personalizado' */

      },
      inputAttributes: {
        autocapitalize: 'off',
        maxlength: '17',
        autocorrect: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Siguiente',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      denyButtonText: `Avanzado`,
      preConfirm: (nameType) => {
        if (nameType != '') {
          if (nameType === 'task') {
            this.addRememberTask(nameType);
          } else if (nameType === 'meet') {
            this.addRememberMeet(nameType);

          }

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Debe seleccionar un tipo de recordatorio',
            /*      text: 'Debe tener más de un caracter', */
            confirmButtonText: 'Entendido',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.addRemember();
            }
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        this.router.navigateByUrl('/main/add-project');
      }
    });

  }

  addRememberTask(nameType: string) {

    Swal.fire({
      title: 'Creación de un recordatorio',
      /*   text: 'Seleccionar un tipo de recordatorio.', */
      inputPlaceholder: 'Seleccionar la condición de recordatorio',
      input: 'select',
      inputOptions: {
        'Para todas las tareas': {
          'allDays': 'Todos los dias',
          'allMondays': 'Todos los lunes'
        }
      },
      inputAttributes: {
        autocapitalize: 'off',
        maxlength: '17',
        autocorrect: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'crear',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      denyButtonText: `Avanzado`,
      preConfirm: (conditionTime) => {
        if (conditionTime != '') {
          this.saveRememberTask(nameType, conditionTime);

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Debe seleccionar un tipo de recordatorio',
            /*      text: 'Debe tener más de un caracter', */
            confirmButtonText: 'Entendido',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.addRememberTask(nameType);
            }
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        this.router.navigateByUrl('/main/add-project');
      }
    });
  }

  saveRememberTask(nameType: string, conditionTime: string) {
    this.authService
      .saveRemember(this.user, nameType, conditionTime, 0)
      .subscribe(
        async (resp) => {
          /*  console.log(resp); */
          /* this.router.navigateByUrl('/main/add-project'); */

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
            title: 'Se ha creado el recordatorio exitosamente.'
          })

          setTimeout(() => {
            this.getRemembers();

          }, 1000);
        },
        (err: { message: string | undefined }) => {
          Swal.fire('Error', err.message, 'error');
        }
      );

  }

  addRememberMeet(nameType: string) {
    Swal.fire({
      title: 'Creación de un recordatorio',
      /*   text: 'Seleccionar un tipo de recordatorio.', */
      inputPlaceholder: 'Seleccionar la condición de recordatorio',
      input: 'select',
      inputOptions: {
        'Para todas las reuniones': {
          '30min': '30 minutos antes de iniciar la reunión',
          '1h': '1 hora antes de iniciar la reunión',
          '24h': '24 horas antes de iniciar la reunión'
        }

      },
      inputAttributes: {
        autocapitalize: 'off',
        maxlength: '17',
        autocorrect: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'crear',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      denyButtonText: `Avanzado`,
      preConfirm: (conditionTime) => {
        if (conditionTime != '') {
          this.saveRememberMeet(nameType, conditionTime);

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Debe seleccionar un tipo de recordatorio',
            /*      text: 'Debe tener más de un caracter', */
            confirmButtonText: 'Entendido',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.addRememberMeet(nameType);
            }
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        this.router.navigateByUrl('/main/add-project');
      }
    });
  }

  saveRememberMeet(nameType: string, conditionTime: string) {
    this.authService
      .saveRemember(this.user, nameType, conditionTime, 0)
      .subscribe(
        async (resp) => {
          /*  console.log(resp); */
          /* this.router.navigateByUrl('/main/add-project'); */

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
            title: 'Se ha creado el recordatorio exitosamente.'
          })

          setTimeout(() => {
            this.getRemembers();

          }, 1000);
        },
        (err: { message: string | undefined }) => {
          Swal.fire('Error', err.message, 'error');
        }
      );
  }

  getRemembers() {

    this.authService.getRemembers(this.user.email).subscribe(
      async (resp) => {
        console.log('Recordatorios DEL USUARIO', resp);
        this.remembersUserSelected = resp;

        console.log("RECUERDOS SELECCIONADOS", this.remembersUserSelected)


        /* this.router.navigateByUrl('/main/add-project'); */

        /*         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Visualizando acta: ',
          showConfirmButton: false,
          timer: 2000,
        }); */
        /*     this.meetingMinuteForm.reset(); */
        setTimeout(() => {
          /*   this.getCompromisesPreviews(); */
          /*     location.reload(); */
        }, 2000);
      },
      (err: { message: string | undefined }) => { }
    );

  }

  addRemember2(nameType: string) {

  }

  getUserProfile(userId: string) {
    console.log('MEETING MINUTE', userId);

    this.authService.getUserProfile(userId).subscribe(
      async (resp) => {
        
        this.authService
        .saveProjectCurrent3(this.user.id, resp)
        .subscribe(
          async (resp) => {
            console.log("[USER] se ha guardado este usuario", this.userSelected)
          },
          (err: { message: string | undefined }) => { }
        );
  

        this.userSelected = resp;
        this.userSelected.password = '';

        this.authService.getCompromisesUser(this.user.email).subscribe(
          async (resp) => {
            console.log('COMPROMISOS DEL USUARIO', resp);


            this.compromisesUserSelected = resp;
            console.log("COMRPOMISOS SELECCIONADOS", this.compromisesUserSelected)


            /* this.router.navigateByUrl('/main/add-project'); */

            /*         Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Visualizando acta: ',
              showConfirmButton: false,
              timer: 2000,
            }); */
            /*     this.meetingMinuteForm.reset(); */
            setTimeout(() => {
              /*   this.getCompromisesPreviews(); */
              /*     location.reload(); */
            }, 2000);
          },
          (err: { message: string | undefined }) => { }
        );

        /* this.router.navigateByUrl('/main/add-project'); */

        /*         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Visualizando acta: ',
          showConfirmButton: false,
          timer: 2000,
        }); */
        /*     this.meetingMinuteForm.reset(); */
        setTimeout(() => {
          /*   this.getCompromisesPreviews(); */
          /*     location.reload(); */
        }, 2000);
      },
      (err: { message: string | undefined }) => { }
    );
  }

  saveRemember() { }

  async setStateElement(idElement: string) {

    const { value: modification } = await Swal.fire({
      title: 'Actualizar estado',
      input: 'select',
      inputOptions: {
        Estado: {
          new: 'Nuevo',
          desarrollo: 'En desarrollo',
          finalizado: 'Finalizado'
        },
      },
      inputPlaceholder: 'Seleccionar el nuevo estado para el compromiso',
      showCancelButton: true,
    });

    if (modification) {
      this.setState(idElement, modification);
    }

  }

  setState(idElement: string, state: string) {

    this.authService.setStateElement(idElement, state).subscribe(
      async (resp) => {

        this.compromisesUserSelected = resp;
        console.log("COMRPOMISOS SELECCIONADOS", this.compromisesUserSelected)


        /* this.router.navigateByUrl('/main/add-project'); */
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
          title: 'Se ha actualizado el estado exitosamente.'
        })

        setTimeout(() => {
          /*   this.getCompromisesPreviews(); */
          /*     location.reload(); */
        }, 2000);
        this.getUserProfile(this.user.id);
      },
      (err: { message: string | undefined }) => { }
    );

  }


  deleteRemember(idReminder: string){

    this.authService.deleteRemember(idReminder).subscribe(
      async (resp) => {

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
          title: 'Se ha eliminado el recordatorio exitosamente.'
        })

        this.getRemembers();
      },
      (err: { message: string | undefined }) => { }
    );

  }


}
