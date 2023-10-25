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

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() sideNavStatus: boolean = true;


  // Variables de evento emitido al menu component
  @Output() projectStatus = new EventEmitter<string>();
  @Output() meetingStatus = new EventEmitter<string>();
  @Output() changeStatus = new EventEmitter<string>();
  @Output() sectionStatus = new EventEmitter<string>();
  @Output() projectStatusFunction = new EventEmitter<any>();

  // Complemento a las variables emitidas
  newParticipants: any = [];
  nameProjectEmite: string = '';
  nameMeetingEmite: string = '';
  nameSectionEmite: string = 'noSection';
  idMeetingEmite: string = '';
  idProjectEmite: string = '';

  // Variables de edicion
  isProyectos = true;
  isReuniones = false;

  // Variables de identificacion
  currentProject = 'Default';
  currentMeeting = 'Default';
  currentState = 'Default';

  // Variables de proyecto
  projects: any;
  projectSelectedId: string = '';
  projectsFilters: any;
  projectSelected: any;

  // Variables de reunion
  meetingSelectedId: string = '';
  countMeetings: any = 1;
  meetings: any;

  // Variables de acceso
  logged = false;
  user: any;
  userRol: any;
  userEditForm!: FormGroup;
  userSelected: any;
  isOwner = false;
  isMember = false;

  // Formularios
  searchForm!: FormGroup;

  isSecretary = false;

  // ____________________________
  // CONSTRUCTOR
  //_____________________________
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private socket: Socket
  ) {


    // evento de recargar pagina
    socket.fromEvent('new_reload').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
      } else {
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
          title: 'Usuario:' + user.email + ' cambiando opciones de sesión. Se reiniciará la pagina web.',
        })
        setTimeout(() => {
          location.reload();
        }, 5000);
      }
    });

    // evento de nuevo usuario uniendose a la sesion
    socket.fromEvent('new_user').subscribe(async (user: any) => {
      console.log('USER NUEVO UNIENDOSE: ', user);
      let stringAux2 = '' + user.tagName + ',' + user.color + ',' + user.name + ',' + user.email + ',' + user.institution;
      this.authService
        .getMeetingMinute(user.currentMeetingId)
        .subscribe(
          async (resp) => {
            let secretaries = resp[0].secretaries;
            let participants = resp[0].participants;
            let leaders = resp[0].leaders;
            console.log("[SIDEBAR] MEETING MINUTE DEL COMPADRE QUE ENTRO, :", resp);

            if (secretaries.includes(this.user.email)) {
              this.isSecretary = true;
            }
            if (leaders.includes(this.user.email)) {
              this.isSecretary = true;
            }


            if (secretaries.includes(user.email)) {
              stringAux2 = stringAux2 + ',' + 'Secretario';
            }
            else if (participants.includes(user.email)) {
              stringAux2 = stringAux2 + ',' + 'Asistente';
            } else if (leaders.includes(user.email)) {
              stringAux2 = stringAux2 + ',' + 'Lider';
            } else {
              stringAux2 = stringAux2 + ',' + 'Espectador';
            }


            if (!this.newParticipants.includes(stringAux2) /* && user.id != this.userSelected.id */) {

              this.newParticipants.push(stringAux2);

              if (user.currentMeeting != '') {
                await this.joinRoom(user.currentMeetingId);
              } else {
                await this.joinRoom(user.currentProjectId);
              }

            }
            this.getProjectId(user.currentProjectId);

          },
          (err: any) => {
          }
        );
      this.changeStatus.emit(this.newParticipants);
      console.log('USUARIOS TOTALES: ', this.newParticipants);
    });

    // evento de usuario saliendo de la sesion
    socket.fromEvent('left_user').subscribe((user: any) => {
      console.log('USUER SALIENDOSE: ', user);

      let stringAux3 = '' + user.name + ',' + user.color;
      let pos = this.newParticipants.indexOf(stringAux3);
      console.log('POSICIOIN A ELIMINAR: ', pos);
      this.newParticipants.splice(pos, 1);

      console.log('USUARIOS: ', this.newParticipants);
      this.changeStatus.emit(this.newParticipants);
    });

    // Evento de que se ha creado una nueva reunion
    socket.fromEvent('new_meet').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
      } else {
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

    // Evento de que se ha creado un nuevo proyecto
    socket.fromEvent('new_project').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
        console.log('USUARIO SOY YO: ', user);
      } else {
        console.log('USUARIO VIENDO NUEVA PROYECTO: ', user);
        this.listProjectsInicial();
        let stringAux2 = user.email
      }
    });

    // Identificar al usuario logeado
    this.authService.userLogin().subscribe(
      async (resp) => {
        this.user = resp;
        this.getUserProfile(this.user.id);
      },
      (err) => {
      }
    );
  }

  // ____________________________
  // NG ON INIT
  //_____________________________
  ngOnInit(): void {

    // Formulario de buscar
    this.searchForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
    });
    // Se listan los proyectos del usuario al inciar
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

            if (resp2.lastLink === '/main/task') {
              /*  this.router.navigateByUrl('/main/task'); */

            } else {
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

            }


          },
          /* (err: { message: string | undefined }) => { } */
        );

        /*   this.userTag = resp */
      },
      (err) => {
        if (err.status === 401) {
          this.router.navigateByUrl('auth/login');
/*           Swal.fire({
            title: 'Autentificarse en la plataforma antes de ingresar a la reunión.',
            text: "",
            icon: 'info',


          }

          ) */
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

        this.projectStatusFunction.emit(this.currentProject);
        this.projectStatus.emit(this.currentProject);
        this.meetingStatus.emit(this.currentMeeting);
        /* this.sectionStatus.emit('nada'); */
        console.log("[USER] ha iniciado con el usuario: ", resp);
        if (resp.lastLink === '/main/task') {
          this.router.navigateByUrl(resp.lastLink);
        } else if (this.currentProject != '') {
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

  listMeetingsInicialRefresh() {
    this.authService.meeting(this.projectSelectedId).subscribe(
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
      /*   this.projectSelectedId = id; */
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
  getProjectId(id: string) {

    // solicitamos saber cual es taoda la informacion del proyecto en base a id
    this.authService.projectById(id).subscribe(
      (resp: any) => {

        console.log('[edit project] proyecto obtenido: ', resp);
        this.projectSelected = resp;

        let result1 = this.projectSelected.userOwner.filter((role: any) =>
          role.includes(this.user.email)
        );
        let result2 = this.projectSelected.userMembers.filter((role: any) =>
          role.includes(this.user.email)
        );

        if (result1.length > 0) {
          this.isOwner = true;
          this.isMember = true;
        } else if (result2.length > 0) {
          this.isOwner = false;
          this.isMember = true;
        } else {
          this.isOwner = false;
          this.isMember = false;
        }
      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
  }
  //! ________________
  //! EDIT PROYECT
  //! ________________
  async editProject(id: string, nameProject: string) {

    this.getProjectId(id);

    console.log("[sidebar] ID DEL PROYECTO: ", id);
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
    this.nameSectionEmite = '  ';

    /*     console.log('MENU STATUS: ', this.nameProjectEmite); */
    this.projectStatus.emit(this.nameProjectEmite);
    this.projectStatusFunction.emit(this.currentProject);
    this.meetingStatus.emit(this.nameMeetingEmite);
    this.sectionStatus.emit('    ');

    /*  this.projectStatus.emit(this.idProjectEmite);
    this.meetingStatus.emit(this.idMeetingEmite); */

    this.authService.meeting(id).subscribe(
      async (resp: any) => {
        this.meetings = resp;
        if (resp.length === 0) {
          let largo = resp.length;
          console.log("REUNION LARGO: ", largo);

          this.countMeetings = 0;
        } else {
          let largo = resp.length - 1;
          console.log("REUNION LARGO: ", largo);

          let ultimo = this.meetings[largo].name;

          let numberUltimo = parseInt(ultimo.split(' ')[1]);
          console.log("REUNION Ultimo: ", numberUltimo);

          this.countMeetings = numberUltimo + 1;
        }

        /*       let numeroultimo = parseInt(ultimo);
              console.log("REUNION Ultimo: ", numeroultimo); */

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

        if (this.userSelected.lastLink === '/main/task') {
          /* this.router.navigateByUrl('/main/task'); */

        } else {
          this.router.navigateByUrl('/main/' + this.projectSelectedId + '/edit-project');
        }




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
    if (this.userSelected.lastLink === '/main/task') {

      /* this.router.navigateByUrl('/main/task'); */
    } else {
      this.userSelected.lastLink = url2;
    }


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
    console.log('I DE DE PROJECTO ', this.projectSelectedId); */

    // EVENTO EMITIDO!
    this.nameMeetingEmite = nameMeeting;
    /*     console.log('MENU STATUS: ', this.nameMeetingEmite); */
    this.meetingStatus.emit(this.nameMeetingEmite);

    let numberRandom = this.getRandomInt(5);
    let espaciosRandom = ' ';
    for (let i = 0; i < numberRandom; i++) {
      espaciosRandom = espaciosRandom + ' ';
    }
    this.sectionStatus.emit(espaciosRandom);
    if (this.userSelected.lastLink === '/main/task') {
      /* this.router.navigateByUrl('/main/task'); */

    } else {
      this.router.navigateByUrl(url2);
    }


  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  addMeeting() {
    /*     const url2 = '/main/' + this.projectSelectedId + '/add-meeting'; */
    /*     console.log(this.projectSelectedId); */
    /*     this.router.navigateByUrl(url2); */
    /*     console.log(this.countMeetings); */

    // Identificar al usuario logeado
    this.authService.userLogin().subscribe(
      async (resp) => {
        this.user = resp;
        await this.getUserProfile(this.user.id);

        this.authService.meeting(this.userSelected.currentProjectId).subscribe(
          async (resp: any) => {
            this.meetings = resp;
            if (resp.length === 0) {
              let largo = resp.length;
              console.log("REUNION LARGO: ", largo);
              this.countMeetings = 0;
              this.authService
                .addMeeting(this.projectSelectedId, 0)
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

                        console.log("PROYECTO DESDE DONDE SE CREA: ",this.projectSelectedId );
                        this.meetings = resp;
                        if (resp.length === 0) {
                          let largo = resp.length;
                          console.log("REUNION LARGO: ", largo);

                          this.countMeetings = 0;
                        } else {
                          let largo = resp.length - 1;
                          console.log("REUNION LARGO: ", largo);

                          let ultimo = this.meetings[largo].name;

                          let numberUltimo = parseInt(ultimo.split(' ')[1]);
                          console.log("REUNION Ultimo: ", numberUltimo);

                          this.countMeetings = numberUltimo + 1;
                        }

                        let payloadSave = {
                          room: this.projectSelectedId,
                          user: this.user
                        }
                        this.socket.emit('event_meet', payloadSave);

                        let payloadSave2 = {
                          room: this.meetingSelectedId,
                          user: this.user
                        }
                        this.socket.emit('event_meet', payloadSave2);

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


            } else {
              let largo = resp.length - 1;
              console.log("REUNION LARGO: ", largo);

              let ultimo = this.meetings[largo].name;

              let numberUltimo = parseInt(ultimo.split(' ')[1]);
              console.log("REUNION Ultimo: ", numberUltimo);

              this.countMeetings = numberUltimo + 1;

              this.authService
                .addMeeting(this.projectSelectedId, numberUltimo + 1)
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
                        if (resp.length === 0) {
                          let largo = resp.length;
                          console.log("REUNION LARGO: ", largo);

                          this.countMeetings = 0;
                        } else {
                          let largo = resp.length - 1;
                          console.log("REUNION LARGO: ", largo);

                          let ultimo = this.meetings[largo].name;

                          let numberUltimo = parseInt(ultimo.split(' ')[1]);
                          console.log("REUNION Ultimo: ", numberUltimo);

                          this.countMeetings = numberUltimo + 1;
                        }



                        let payloadSave = {
                          room: this.projectSelectedId,
                          user: this.user
                        }
                        this.socket.emit('event_meet', payloadSave);

                        let payloadSave2 = {
                          room: this.meetingSelectedId,
                          user: this.user
                        }
                        this.socket.emit('event_meet', payloadSave2);

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
          },
          (err: string | undefined) => {
            Swal.fire('Error', err, 'error');
          }
        );
      },
      (err) => {
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
        this.volverProyects();

      } else if (result.isDenied) {

      }
    })
  }

  borrarMM(id: string) {
    Swal.fire({
      title: '¿Eliminar reunión?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar reunión',
      denyButtonText: `No`,
    }).then((result) => {

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.borrarM(id);

      } else if (result.isDenied) {
      }
    })

  }

  borrarM(id: string) {
    this.authService.borrarMeet(id).subscribe(
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
          title: 'Se ha borrado la reunión exitosamente.'
        })

        setTimeout(() => {
          this.listMeetingsInicial(this.userSelected.currentProjectId);
        }, 1000);

      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
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
