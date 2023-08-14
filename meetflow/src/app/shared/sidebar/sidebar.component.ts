import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/main', title: 'nombre 1 ', icon: 'pe-7s-home', class: '' },
  { path: '/login', title: 'nombre 2', icon: 'pe-7s-note2', class: '' },
  { path: '/main', title: 'nombre 3', icon: 'pe-7s-plus', class: '' },
  {
    path: '/management/board',
    title: 'nombre 4',
    icon: 'pe-7s-albums',
    class: '',
  },
  {
    path: '/list-reports',
    title: 'nombre 5',
    icon: 'pe-7s-copy-file',
    class: '',
  },
  /* { path: '/observation', title: 'Observación',  icon: 'pe-7s-comment', class: '' }, */
  { path: '/stats', title: 'nombre 6', icon: 'pe-7s-graph', class: '' },
  // { path: '/user', title: 'User Profile',  icon: 'pe-7s-user', class: '' },
  // { path: '/table', title: 'Table List',  icon: 'pe-7s-note2', class: '' },
  // { path: '/typography', title: 'Typography',  icon: 'pe-7s-news-paper', class: '' },
  // { path: '/icons', title: 'Icons',  icon: 'pe-7s-science', class: '' },
  // { path: '/notifications', title: 'Notifications',  icon: 'pe-7s-bell', class: '' },
  // { path: '/checking', title: 'Checking',  icon: 'pe-7s-note2', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() sideNavStatus: boolean = true;

  // VARIABLES EVENTO EMITIDO!
  @Output() projectStatus = new EventEmitter<string>();
  @Output() meetingStatus = new EventEmitter<string>();
  @Output() changeStatus = new EventEmitter<string>();

  newParticipants: any = [];
  nameProjectEmite: string = '';
  nameMeetingEmite: string = '';
  idMeetingEmite: string = '';
  idProjectEmite: string = '';

  list = [
    {
      number: '1',
      name: 'home',
      icon: 'fa-solid fa-house',
    },
  ];

  isProyectos = true;
  isReuniones = false;

  currentProject = 'Default';
  currentMeeting = 'Default';
  currentState = 'Default';

  menuItems: any[] = ROUTES;
  logged = false;
  process = false;
  projects: any;
  projectSelectedId: string = '';
  meetingSelectedId: string = '';
  countMeetings: any = 1;
  meetings: any;

  miFormulario: FormGroup = this.fb.group({
    asd: ['proyect 2'],
  });

  persona = {
    asd: 'proyecto 3',
  };
  projectsFilters: any;

  user: any;
  userRol: any;
  userEditForm!: FormGroup;
  userSelected: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private socket: Socket
  ) {

    socket.fromEvent('new_reload').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
        console.log('USUARIO SOY YO GUARDANDO: ', user);
      } else {
        console.log('USUARIO RECARGANDO: ', user);

        
        let stringAux2 = user.email

    
        console.log('USUARIO RECARGANDO: ', user);
     

        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
  
        Toast.fire({
          icon: 'success',
          title: 'Usuario:' + user.email + ' cambiando opciones de sesión. Se reiniciará la pagina web.',
        })

        setTimeout(() => {
          location.reload();
        }, 5000);
        

      }
    });

    //! AQUI VAMOS SUMANDO A LOS NUEVOS

    socket.fromEvent('new_user').subscribe(async (user: any) => {

      console.log('USER NUEVO UNIENDOSE: ', user);
      let stringAux2 = '' + user.tagName + ',' + user.color + ',' + user.name + ',' + user.email + ',' + user.institution;

      this.authService
        .getMeetingMinute(user.currentMeetingId)
        .subscribe(
          async (resp) => {

   /*          const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Se ha unido el usuario: ' + user.email + ' a la sesión.'
            }) */

            let secretaries = resp[0].secretaries;
            let participants = resp[0].participants;
            let leaders = resp[0].leaders;

            console.log("[SIDEBAR] MEETING MINUTE DEL COMPADRE QUE ENTRO, :", resp);
            if (secretaries.includes(user.email)) {
              stringAux2 = stringAux2 + ',' + 'Secretario';
              /* console.log("[SIDEBAR] ES SECRETARIO", user.email, stringAux2) */
            }
             else if(participants.includes(user.email)) {
              stringAux2 = stringAux2 + ',' + 'Participante';
              /* console.log("[SIDEBAR] NO ES SECRETARIO", user.email, stringAux2); */
            } else if(leaders.includes(user.email)){
              stringAux2 = stringAux2 + ',' + 'Lider';
            /*   console.log("[SIDEBAR] NO ES SECRETARIO", user.email, stringAux2); */
            }else{
              stringAux2 = stringAux2 + ',' + 'Invitado';
            }

            if (!this.newParticipants.includes(stringAux2) && user.id != this.userSelected.id) {
              console.log('SE HA AÑADIDO EL USUARIO: ', stringAux2);

              this.newParticipants.push(stringAux2);

              console.log('REUNION A REENVIAR: ', user.id);
              /*  this.joinRoom(user.id); */
              /*  estoyAqui(user.id); */
              if (user.currentMeeting != '') {
                await this.joinRoom(user.currentMeetingId);
              } else {
                await this.joinRoom(user.currentProjectId);
              }


              /*  this.joinRoom(user.id); */
            }

          },

          (err: any) => {

          }

        );

      this.changeStatus.emit(this.newParticipants);

      console.log('USUARIOS TOTALES: ', this.newParticipants);
    });

    //! AQUI VAMOS QUITANDO A LOS QUE SE VAN

    socket.fromEvent('left_user').subscribe((user: any) => {
      console.log('USUER SALIENDOSE: ', user);

      let stringAux3 = '' + user.name + ',' + user.color;
      let pos = this.newParticipants.indexOf(stringAux3);
      console.log('POSICIOIN A ELIMINAR: ', pos);
      this.newParticipants.splice(pos, 1);

      console.log('USUARIOS: ', this.newParticipants);
      this.changeStatus.emit(this.newParticipants);
/*       const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'Usuario: ' + user.email + ' saliendo de la sesión.'
      }) */
    });

    // METODO PARA ENTERARME DE QUE SE CREO UNA REUNION

    socket.fromEvent('new_meet').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
        console.log('USUARIO SOY YO: ', user);
      } else {
        console.log('USUARIO VIENDO NUEVA REUNION: ', user);
        this.listMeetingsInicial(this.userSelected.currentProjectId);
        let stringAux2 = user.email

        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Usuario: ' + user.email + ' creando una nueva reunión.'
        })
      }
    });

    // METODO PARA ENTERARME DE QUE SE CREO UN PROOJECTO

    socket.fromEvent('new_project').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
        console.log('USUARIO SOY YO: ', user);
      } else {
        console.log('USUARIO VIENDO NUEVA PROYECTO: ', user);
        this.listProjectsInicial();
        let stringAux2 = user.email

        
      }
    });

    this.authService.userLogin().subscribe(
      async (resp) => {
        /* console.log('CUAL ES EL USUARIO DESDE SIDEBAR?', resp); */
        this.user = resp;
        this.getUserProfile(this.user.id);


      },
      (err) => {
        /*    Swal.fire('Error', err.message, 'error'); */
      }
    );

    /*         this.currentProject =  this.userSelected.currentProject;
    this.currentMeeting =  this.userSelected.currentMeeting; */
    /*   this.listProjectsInicial();
      this.miFormulario.reset({ ...this.persona}); */
    /*  this.listMeetingsInicial("639add0a0292225f19c9c870"); */
  }

  searchForm!: FormGroup;
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
    });

    /* const bsButton = new bootstrap.Button('#myButton') */
    this.menuItems = ROUTES;
    this.listProjectsInicial();
  }

  eventEmitUserPosition() {
    this.authService.userLogin().subscribe(
      async (resp) => {
        console.log('[NAVBAR] CUAL ES EL USUARIO?', resp);
        this.user = resp;

        this.authService.getUserProfile(resp.id).subscribe(
          async (resp2) => {
            /* console.log('[NAVBAR] TODO LO QUE SOY', resp2); */

            this.userSelected = resp2;
            this.userSelected.password = '';

            /*  console.log(
              '[NAVBAR] Nombre separado por espacios',
              this.nameSplit
            ); */
            /* console.log('[NAVBAR] TAG ', this.nameTag); */

            setTimeout(() => { }, 2000);
            /* console.log('[NAVBAR] PROJECTO', this.userSelected.currentProjectId);
            console.log('[NAVBAR] REUNION', this.meetingSelectedId); */
            let lastLink2 = resp2.lastLink.split('/');
            console.log('[NAVBAR] LINK', lastLink2[3]);

            if (lastLink2[3] === 'meeting') {
              let payload = {
                room: this.userSelected.currentMeetingId,
                user: this.userSelected,
              };
              this.socket.emit('event_message', payload);
            } else if (lastLink2[3] === 'edit-project') {
              let payload = {
                room: this.userSelected.currentProjectId,
                user: this.userSelected,
              };
              this.socket.emit('event_message', payload);
            } else {
              let payload = { room: 'all', user: this.userSelected };
              this.socket.emit('event_message', payload);
            }
          },
          (err: { message: string | undefined }) => { }
        );

        /*   this.userTag = resp */
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigateByUrl('auth/login');
          Swal.fire(
            'Error',
            'Usuario no ingresado, por favor registrarse.',
            'error'
          );
        }
        console.log('ERROR DESDE NAVBAR: ', err);
      }
    );
  }


  //! INICIAAAAAAAAAAAAAAAL

  getUserProfile(userId: string) {
    /*     console.log('ID USUARIO', userId); */

    this.authService.getUserProfile(userId).subscribe(
      async (resp) => {
        /*         console.log('RESPUESTA CUAL ES EL PERFIL DESLDE NAVBAR', resp); */

        this.userSelected = resp;
        this.userSelected.password = 'errorcapa8';
        this.projectSelectedId = resp.currentProjectId;

        this.currentProject = resp.currentProject;
        this.currentMeeting = resp.currentMeeting;

        this.projectStatus.emit(this.currentProject);
        this.meetingStatus.emit(this.currentMeeting);

        if (this.currentProject != '') {
          this.isReuniones = true;
          this.isProyectos = false;
          this.meetingSelectedId = resp.currentMeetingId;
          this.listProjectsInicial();
          this.listMeetingsInicial(resp.currentProjectId);
          this.router.navigateByUrl(resp.lastLink);

          console.log('[SIDEBAR] currentMeeting = ', this.currentMeeting);
          if (resp.currentMeetingId != '') {
            await this.joinRoom(resp.currentMeetingId);
          } else {
            await this.joinRoom(resp.currentProjectId);
          }

        }

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

  listProjectsInicial() {

    this.authService.listProjects().subscribe(
      (resp: any[]) => {
        /*      console.log(resp); */

        this.projects = resp;
      },
      (err: any) => {
        /*         console.log("ESTO ES LO QUE SUEANA?",err.status); */
        if (err.status === '401') {
        }
        this.projects = [];
      }
    );
  }

  listMeetingsInicial(id: string) {
    this.authService.meeting(id).subscribe(
      (resp: any) => {
        /*         console.log('RESPUESTA DE ERROR AL CARGAR PROYECTOS', resp); */
        this.meetings = resp;
      },
      (err) => {
        /*         console.log('RESPUESTA DE ERROR AL CARGAR PROYECTOS', err); */
        Swal.fire('Error', err, 'error');
      }
    );
  }
  //! ------------------------------------
  //! SALIDA DE LA SALA
  //! ------------------------------------
  async leaveRoom(id: string) {
    this.newParticipants = [];
    let payloadLeave3 = {
      room: 'all',
      user: this.userSelected,
    }
    await this.socket.emit('event_leave', payloadLeave3);
    if (this.currentMeeting === '') {
      console.log('ENTRE DONDE NO HAY REUNION');
      let payloadLeave = {
        room: this.meetingSelectedId,
        user: this.userSelected,
      };
      await this.socket.emit('event_leave', payloadLeave);
      //! PROJECT SELECTED ID
      /*       this.changeStatus.emit(''); */
      this.meetingSelectedId = id;
    } else if (this.currentMeeting != '') {
      let payloadLeave2 = {
        room: this.projectSelectedId,
        user: this.userSelected,
      };
      /*       this.changeStatus.emit(''); */
      console.log('ENTRE DONDE SI HAY REUNION');
      await this.socket.emit('event_leave', payloadLeave2);
      //! REUNION SELECTED ID
      this.projectSelectedId = id;
    }
  }


  //! ------------------------------------
  //! ENTRADA A LA SALA
  //! ------------------------------------
  async joinRoom(id: string) {
    /*   console.log("ENVIANDO ESTE USUARIO AL BACKEND:", this.userSelected); */
    let payloadJoin = {
      room: id,
      user: this.userSelected,
    };
    await this.socket.emit('event_join', payloadJoin);
  }

  //! ________________
  //! EDIT PROYECT
  //! ________________
  async editProject(id: string, nameProject: string) {
    /* this.changeStatus.emit(); */
    this.listMeetingsInicial(id);
    this.currentProject = nameProject;
    this.currentMeeting = '';
    /*    this.meetingSelectedId = ''; */

    this.userSelected.currentProject = nameProject;
    this.userSelected.currentProjectId = id;
    this.projectSelectedId = id;

    this.userSelected.currentMeeting = '';
    /*     this.userSelected.currentMeetingId = ''; */
    this.userSelected.lastLink = '/main/' + id + '/edit-project';

    // EVENTO EMITIDO!
    this.nameProjectEmite = nameProject;
    this.nameMeetingEmite = '';
    /*     console.log('MENU STATUS: ', this.nameProjectEmite); */
    this.projectStatus.emit(this.nameProjectEmite);
    this.meetingStatus.emit(this.nameMeetingEmite);

    /*  this.projectStatus.emit(this.idProjectEmite);
    this.meetingStatus.emit(this.idMeetingEmite); */

    this.authService.meeting(id).subscribe(
      async (resp: any) => {
        this.meetings = resp;
        /*         console.log('RESPUESTA', resp); */

        this.authService
          .saveProjectCurrent(this.user.id, this.userSelected)
          .subscribe(
            async (resp) => {
              /*               console.log('RESPUESTA GUARDO PROJECT CURRENT', resp); */
              /* this.router.navigateByUrl('/main/add-project'); */

              /*  setTimeout(() => {}, 2000); */
              //! EVENTO DE QUE ESTOY EN EL PROYECTO

              //! EVENTO DE QUE ME ESTOY SALIENDO DE REUNION
              await this.leaveRoom(id);
              //! EVENTO DE QUE ME CONECTO A LA SALA PROYECTO
              /*  this.initRoom(); */
              this.joinRoom(id);


              this.changeStatus.emit(this.newParticipants);
            },
            (err: { message: string | undefined }) => { }
          );

        const asd = await this.router.navigateByUrl('/main/loading');
        this.router.navigateByUrl('/main/' + id + '/edit-project');


        /*         console.log('MEETING', this.meetings); */

        this.countMeetings = this.meetings.length;

        /*         console.log('CANTIDAD', this.countMeetings); */

        /*  Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'reuniones cargadas correctamente',
        showConfirmButton: false,
        timer: 1000
      }) */

        this.isProyectos = false;
        this.isReuniones = true;
      },
      (err: string | undefined) => {
        Swal.fire('Error', err, 'error');
      }
    );
  }

  editProject2() { }

  //! ________________
  //! EDIT MEETING
  //! ________________
  editMeeting(id: string, nameMeeting: string) {
    /*  this.changeStatus.emit(); */

    let aux1 = this.projectSelectedId;
    const url2 = '/main/' + aux1 + '/meeting/' + id;
    this.currentMeeting = nameMeeting;
    this.userSelected.currentMeeting = nameMeeting;
    this.userSelected.currentMeetingId = id;
    this.meetingSelectedId = id;

    this.userSelected.lastLink = url2;

    this.authService
      .saveProjectCurrent(this.user.id, this.userSelected)
      .subscribe(
        async (resp) => {
          /*         console.log('RESPUESTA CURRENT MEETING', resp); */
          /* this.router.navigateByUrl('/main/add-project'); */

          /*  setTimeout(() => {}, 2000); */
          //! EVENTO DE QUE ESTOY EN LA REUNION
          /*  let payload = {
            room: id,
            user: this.userSelected,
          }; */

          /*  this.socket.emit('event_message', payload); */

          //! EVENTO DE QUE ME ESTOY SALIENDO DE REUNION
          await this.leaveRoom(id);

          //! LIMPIAR BOTONES
          /*   this.newParticipants = ['']; */
          /*      this.changeStatus.emit(this.newParticipants); */

          //! EVENTO DE QUE ME CONECTO A LA SALA PROYECTO
          /*  this.initRoom(); */
          await this.joinRoom(id);

          /*     this.changeStatus.emit(this.newParticipants); */
        },
        (err: { message: string | undefined }) => { }
      );

    /*  console.log(url2) */
    /*     console.log('IDE DE REUNION ', id);
    console.log('IDE DE PROJECTO ', this.projectSelectedId); */

    // EVENTO EMITIDO!
    this.nameMeetingEmite = nameMeeting;
    /*     console.log('MENU STATUS: ', this.nameMeetingEmite); */
    this.meetingStatus.emit(this.nameMeetingEmite);

    this.router.navigateByUrl(url2);
  }

  addMeeting() {
    /*     const url2 = '/main/' + this.projectSelectedId + '/add-meeting'; */
    /*     console.log(this.projectSelectedId); */
    /*     this.router.navigateByUrl(url2); */
    /*     console.log(this.countMeetings); */



    this.authService
      .addMeeting(this.projectSelectedId, this.countMeetings)
      .subscribe(
        (resp: any) => {
          /*       console.log('RESP 1:', resp); */
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
            title: 'Se ha creado la reunión exitosamente.'
          })

          this.authService.meeting(this.projectSelectedId).subscribe(
            (resp: any) => {
              /*            console.log('RESP 2', resp); */

              this.meetings = resp;
              this.countMeetings = this.meetings.length;

              let payloadSave = {
                room: this.meetingSelectedId,
                user: this.user
              }
              this.socket.emit('event_meet', payloadSave);

              /*      Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'reuniones cargadas correctamente',
          showConfirmButton: false,
          timer: 1000
        })  */
            },
            (err: string | undefined) => {
              Swal.fire('Error', err, 'error');
            }
          );
        },
        (err: string | undefined) => {
          Swal.fire('Error', err, 'error');
        }
      );
  }

  onScroll() { }

  agregarProjectNew() {
    Swal.fire({
      title: 'Creacion de un proyecto',
      text: 'Ingresar un nombre corto para el proyecto. ',
      input: 'text',
      inputPlaceholder: 'Escribir nombre aquí (max 17 caracteres)',
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
      preConfirm: (nameProject) => {
        if (nameProject != '') {
          this.crearProject(nameProject);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Nombre del proyecto es invalido',
            text: 'Debe tener más de un caracter',
            confirmButtonText: 'Entendido',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.agregarProjectNew();
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

  crearProject(nameProject: string) {
    this.authService.addProject(nameProject, 'Sin descripción').subscribe(
      (resp: any[]) => {
        /*       console.log(resp); */
        this.listProjectsInicial();
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
          title: 'Se ha creado el proyecto ' + nameProject + ' exitosamente.'
        })

      },
      (err: any) => {
        /*         console.log(err); */
        Swal.fire(
          'Error',
          'Nombre de proyecto no disponible, por favor intentar con otro nombre.',
          'error'
        );
      }
    );
  }

  // VOLVER A PROYECTOS
  async volverProyects() {
    this.router.navigateByUrl('/main');
    /* this.projectSelectedId */
    //! EVENTO DE QUE ME ESTOY SALIENDO DE REUNION
    await this.leaveRoom(this.meetingSelectedId);
    await this.leaveRoom(this.projectSelectedId);

    //! EVENTO DE QUE ME CONECTO A LA SALA PROYECTO
    /*  this.initRoom(); */
    this.joinRoom('all');
    this.isProyectos = true;
    this.isReuniones = false;

  }

  borrarPP(id: string) {

    Swal.fire({
      title: '¿Eliminar proyecto?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar Proyecto',
      denyButtonText: `No`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.borrarP(id);

      } else if (result.isDenied) {

      }
    })


  }


  borrarP(id: string) {

    this.authService.borrarProject(id).subscribe(
      async (resp) => {
        /*      console.log(resp); */
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
          title: 'Se ha borrado el proyecto exitosamente.'
        })
        this.miFormulario.reset();
        /*       setTimeout(() => {
                this.router.navigateByUrl('/main');
              }, 2000); */
        setTimeout(() => {
          this.listProjectsInicial();
        }, 1000);
      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
  }

  addMember(idProject: string) {
    Swal.fire({
      title: 'Equipo de proyecto',
      text: '¿Email del usuario?',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Añadir como Miembro',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      denyButtonText: `Añadir como Secretario`,
      preConfirm: (emailMember) => {
        console.log('EMAIL: ', emailMember);
        /*         console.log('PROJECTO: ', this.projectSelected); */
        this.createMember(emailMember, idProject);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        console.log('RESULTADO ROJO', result);
        /*    this.router.navigateByUrl('/main/add-project'); */
      }
    });
  }

  createMember(emailMember: string, idProject: string) {
    this.authService.getUserByEmail(emailMember).subscribe(
      (resp) => {
        console.log(
          'EDIT_PROYECT respuesta de si es que hay un email con eso',
          resp
        );
        /*         this.listProjectsInicial(); */

        if (resp === null) {
          Swal.fire({ title: 'El correo electrónico ingresado no pertenece a ningún usuario de la plataforma.', icon: 'error', });
        } else {
          this.authService.addMember(emailMember, idProject).subscribe(
            (resp: any[]) => {
              /*     console.log(resp); */
              /*         this.listProjectsInicial(); */
              /*        this.projectSelected.userMembers.push(emailMember); */

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
                title: 'Se ha borrado el proyecto exitosamente.' + emailMember
              })

              let payload = {
                room: 'all',
                user: 'aaa',
              };
              this.socket.emit('event_project', payload);

              setTimeout(() => {
                /*           location.reload(); */
              }, 2000);
            },
            (err: any) => {
              /*    console.log(err); */
              Swal.fire('Error', err.message, 'error');
            }
          );
        }
      },
      (err: any) => {
        /*    console.log(err); */
        Swal.fire('Error NO HAY USUARIO', err.message, 'error');
      }
    );
  }

  async searchP() {
    let { name } = this.searchForm.value;

    if (this.isProyectos) {
      if (name != null) {
        let namee: string = name;
        this.authService.listProjects().subscribe(
          async (resp: any[]) => {
            /*   console.log(resp); */

            this.projects = resp;

            let filter = await this.projects.filter(
              (obj: any) => obj.name === '' + namee
            );
            /*     console.log('FILTRO!:', filter);
            console.log('PROJECTS!:', this.projects); */

            this.projects = filter;
            this.searchForm.reset();
          },
          (err: any) => {
            /*        console.log(err); */
            this.projects = [];
          }
        );
      } else {
        this.listProjectsInicial();
      }
    } else {
      if (name != null) {
        let nameee: string = name;
        this.authService.meeting(this.projectSelectedId).subscribe(
          async (resp: any) => {
            /*        console.log('REUNIONES', resp); */

            this.meetings = resp;

            let filter2 = await this.meetings.filter(
              (obj: any) => obj.name === 'Reunión ' + nameee
            );

            /*     console.log('FILTRO REUNIONES', filter2); */
            this.meetings = filter2;
            this.searchForm.reset();
          },
          (err: string | undefined) => {
            Swal.fire('Error', err, 'error');
          }
        );
      } else {
        this.listMeetingsInicial(this.projectSelectedId);
      }
    }
  }
}
