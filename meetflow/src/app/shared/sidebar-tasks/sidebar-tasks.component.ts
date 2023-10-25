import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-tasks',
  templateUrl: './sidebar-tasks.component.html',
  styleUrls: ['./sidebar-tasks.component.css']
})
export class SidebarTasksComponent {
  @Input() sideNavTaskStatus: boolean = true;


  user: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    authService.$emitter.subscribe(() => {
      setTimeout(() => {

        this.ngOnInit();
      }, 1000);
     
  
  
    });
  }

  @Input() nameProjectEmite: string = 'Sin Asignar';

 /*  @Input() nameProjectEmiteFunction() {
    this.funcionEmiter = "chao"
  }  */
  /* @Input() nameProjectEmiteFunction = this.nameProjectEmiteFunction2(); */

  nameProjectEmiteFunction2(name: string){
    return this.funcionEmiter = name;
  }

  //
  funcionEmiter: string = 'hola';

  // Usuario
  userSelected: any;

  // Proyecto
  projectSelected: any = 'hola';

  // Tareas
  compromisesUserSelected: any;
  tasksByUserProject: any;
  tasks: any;

  // Formularios
  searchForm!: FormGroup;

  // Filtros
  filterUser: any;
  filterProject: any;
  filterState: any;

  ngOnInit(): void {
    this.authService.userLogin().subscribe(
      async (resp) => {
        this.user = resp;
        this.getUserProfile(this.user.id);
      },
      (err) => {
        /* Swal.fire('Error', err.message, 'error'); */
      }
    );
    this.listProjectsInicial();

    // Formulario de filtrar por usuarios y proyectos
    this.searchForm = this.fb.group({
      filterUser: ['', [Validators.required, Validators.minLength(20)]],
      filterProject: ['actual', [Validators.required, Validators.minLength(20)]],
      filterState: ['all', [Validators.required, Validators.minLength(20)]],
    });
  }

  // Quien es el usuario que se a logeado?
  getUserProfile(userId: string) {
    this.authService.getUserProfile(userId).subscribe(
      async (resp) => {
        this.userSelected = resp;
        console.log("[tasks]aaaa USUARIO LOGEADO: ", this.userSelected);

        this.authService
          .saveProjectCurrent2(this.user.id, resp)
          .subscribe(
            async (resp) => {
              console.log("[USER] se ha guardado este usuario", this.userSelected)
            },
            (err: { message: string | undefined }) => { }
          );

        this.authService.projectById(resp.currentProjectId).subscribe(
          async (resp) => {
            /*    console.log(resp); */
            this.projectSelected = resp;
            /*     console.log("RESPUESTA FECHA!: ", resp); */
            /* this.router.navigateByUrl('/main/add-project'); */
            this.searchForm.controls['filterUser'].setValue(this.userSelected.email);
            this.searchForm.controls['filterProject'].setValue(this.userSelected.currentProjectId);
            setTimeout(() => {
              /*  Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'informacion del proyecto: ',
              text: resp.name,
              showConfirmButton: false,
              timer: 1000,
            }); */
              console.log("ESTE ES EL PROYECTO VINCULADO: ", this.projectSelected);
            }, 1000);
          },
          (err: { message: string | undefined }) => {

            /*  this.projectSelected ='no proyecto';
             Swal.fire('Error esteeeeeee', err.message, 'error'); */
          }
        );

        this.authService.getTasksByUserProject(resp.email, resp.currentProjectId).subscribe(
          async (resp) => {
            console.log("[TASKS] tareas obtenidas: ", resp);
            this.tasks = resp;
            setTimeout(() => {
            }, 2000);
          },
          (err: { message: string | undefined }) => { }
        );

        setTimeout(() => {

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
          pausada: 'En pausa',
          evaluando: 'En evaluación',
          finalizado: 'Finalizado',
          borrada: 'Eliminada'
        },
      },
      inputPlaceholder: 'Seleccionar el nuevo estado para la tarea.',
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

        this.addTimeReminder(dateLimit, compromise);

        /*  this.saveRememberTask(compromise.description, dateLimit, compromise); */
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

  addTimeReminder(dateLimit: string, compromise: any) {
    Swal.fire({
      title: 'Agregar un recordatorio',
      text: '¿Cuál es la hora para el recordatorio?',
      input: 'text',
      inputAttributes: {
        min: '8',
        max: '120',
        step: '1',
      },
      inputValue: new Date().toLocaleTimeString(),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'crear',

      showLoaderOnConfirm: true,
      showDenyButton: true,
      /*       denyButtonText: `Avanzado`, */
      preConfirm: (timeLimit) => {
        this.saveRememberTask(compromise.description, '' + dateLimit + ' ' + timeLimit, compromise);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {

      }
    });

  }

  saveRememberTask(nameType: string, conditionTime: string, compromiso: any) {
    let timeNotific2: Date;
    timeNotific2 = new Date(conditionTime);
    let date2 = new Date().toLocaleDateString();
    let time2 = new Date().toLocaleTimeString();

    console.log("HOY ACTUAL ES: ", date2);
    console.log("HOY ACTUAL ES: ", time2);
    console.log("FECHA INGRESADA: ", conditionTime);
    const date3 = new Date(date2 + ' ' + time2);


    let restaTimes = timeNotific2[Symbol.toPrimitive]('number') - date3[Symbol.toPrimitive]('number');

    console.log("NUMERO DE FECHA INGRESADO: ", timeNotific2[Symbol.toPrimitive]('number'));
    console.log("NUMERO DE FECHA HOY: ", date3[Symbol.toPrimitive]('number'));
    console.log("NUMERO RESTA FECHAS: ", restaTimes);

    this.authService
      .saveRemember2(this.user, nameType, conditionTime, restaTimes, compromiso.participants)
      .subscribe(
        async (resp) => {
        },
        (err: { message: string | undefined }) => {
          /*  Swal.fire('Error', err.message, 'error'); */
        }
      );

    this.authService
      .saveRemember3(this.user, nameType, conditionTime, restaTimes, compromiso)
      .subscribe(
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
            title: 'Se ha creado el recordatorio exitosamente.'
          })

          setTimeout(() => {

          }, 1000);
        },
        (err: { message: string | undefined }) => {
          /*  Swal.fire('Error', err.message, 'error'); */
        }
      );
  }

  async searchP() {
    let { filterUser, filterProject, filterState } = this.searchForm.value;

    console.log("usuario: " + filterUser + " estado: " + filterState);
    this.authService.getTasksByProject(filterUser, filterProject, filterState).subscribe(

      async (resp: any[]) => {
        /*   console.log(resp); */
        this.tasks = resp;

      },
      (err: any) => {

      }
    );


  }

  listProjectsInicial() {

    this.authService.listProjects().subscribe(
      (resp: any[]) => {
        /*      console.log(resp); */

        this.projects = resp;
      },
      (err: any) => {
        this.projects = ['no hay proyectos'];
        /*         console.log("ESTO ES LO QUE SUEANA?",err.status); */
        if (err.status === '401') {
          this.projects = ['no hay proyectos'];

        }
        this.projects = ['no hay proyectos'];
      }
    );
  }

  projects: any = ['none'];


}
