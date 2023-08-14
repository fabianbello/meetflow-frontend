import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  user: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.userLogin().subscribe(
      async (resp) => {
        console.log('CUAL ES EL USUARIO?', resp);
        this.user = resp;
        this.getUserProfile(this.user.id);
      },
      (err) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
  }
  rememberForm!: FormGroup;
  userSelected: any;
  compromisesUserSelected: any;
  ngOnInit(): void {
    this.rememberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      institution: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  getUserProfile(userId: string) {
    console.log('MEETING MINUTE', userId);

    this.authService.getUserProfile(userId).subscribe(
      async (resp) => {
        console.log('RESPUESTAAAAAAAAA', resp);

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

  addRemember(compromise: any) {
    /*  this.elements.push({uno: id, dos: "adios"}); */
    Swal.fire({
      title: 'Agregar un recordatorio',
      text: '¿Cuál es la fecha para el recordatorio?',
      input: 'text',
      inputAttributes: {
        min: '8',
        max: '120',
        step: '1',
      },

      inputValue: new Date().toLocaleDateString(),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'crear',

      showLoaderOnConfirm: true,
      showDenyButton: true,
      /*       denyButtonText: `Avanzado`, */
      preConfirm: (dateLimit) => {
        this.saveRememberTask(compromise.description, dateLimit);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        /*         this.router.navigateByUrl('/main/add-project'); */
      }
    });
  }

  saveRememberTask(nameType: string, conditionTime: string) {
    let timeNotific2: Date;
    timeNotific2 = new Date(conditionTime);
    let date2 = new Date().toLocaleDateString();
    let time2 = new Date().toLocaleTimeString();
    /*    const date = new Date(date2 + ' 15:00:00'); */
    console.log("HOY ACTUAL ES: ", date2);
    console.log("HOY ACTUAL ES: ", time2);
    console.log("FECHA INGRESADA: ", conditionTime);
    const date3 = new Date(date2 + ' '+  time2);


    let restaTimes = timeNotific2[Symbol.toPrimitive]('number') - date3[Symbol.toPrimitive]('number');

    console.log("NUMERO DE FECHA INGRESADO: ", timeNotific2[Symbol.toPrimitive]('number'));
    console.log("NUMERO DE FECHA HOY: ", date3[Symbol.toPrimitive]('number'));
    console.log("NUMERO RESTA FECHAS: ", restaTimes);

    this.authService.saveRemember2(this.user, nameType, conditionTime, restaTimes).subscribe(async (resp) => { 

    },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );

    this.authService
      .saveRemember(this.user, nameType, conditionTime, restaTimes)
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
/*           let timeNotific: Date; */
          /* timeNotific = new Date(conditionTime + ' 15:00:01'); */
       /*    timeNotific = new Date(conditionTime);
          let date2 = new Date().toLocaleDateString(); */
          /*    const date = new Date(date2 + ' 15:00:00'); */
        /*   const date = new Date(date2);
          console.log("HOY", date2);

          let restaTimes = timeNotific[Symbol.toPrimitive]('number') - date[Symbol.toPrimitive]('number');
 */




          setTimeout(() => {

          }, 1000);
        },
        (err: { message: string | undefined }) => {
          Swal.fire('Error', err.message, 'error');
        }
      );

  }


}
