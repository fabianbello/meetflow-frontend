import { Component, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import Swal from 'sweetalert2';
import { Socket } from 'ngx-socket-io';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-meeting-minute',
  templateUrl: './meeting-minute.component.html',
  styleUrls: ['./meeting-minute.component.css'],
})
export class MeetingMinuteComponent {

  isDarkMode = true;

  // Variables de edicion
  isEditableObjetivo = false;
  isEditableLugar = false;
  isEditableUser = false;
  isDateError = true;
  isTimeMeet = 'X';

  // Variables dedespliegue
  isAsistentesColapse = true;
  isTemarioColapse = false;
  isDesarrolloColapse = false;
  isAdjuntoColapse = true;

  // elemento seleccionado
  selectType = '';
  isEditableFecha = false;
  isEditableInicio = false;
  isEditableTermino = false;
  isCompromisosPreviosColapse = true;

  durationRealMeeting = 0;

  vacio: string = '         ';
  first: boolean = true;
  links = [' '];

  realDuration = {
    time: new Date()
  }

  desplega = true;

  listaCantForTopic = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  listaCantForTopic2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  isEditable = false;
  projectSelectedId: string = '';

  // PROYECTO
  projectSelected: any = '';
  meetingSelectedId: string = '';


  dateInitialDay = 'día';
  dateInitialMonth = 'mes';
  dateInitialYear = 'año';

  meetingSelectedStatus: string = '';
  isAvailableDialog: boolean = false;
  state: string = 'instancia';
  isSecretary = false;
  isLeader = false;
  isParticipant = false;
  selectTopic = -1;
  selectElementId = '';
  numerExperimental = 0;

  cantElements = 0;
  cantElementsThis = 0;

  closeResult: string | undefined;


  MeetingMinuteSelected = {
    id: '',
    name: '',
    place: '',
    fechaI: '',
    fechaT: new Date(),
    startHour: '00:00',
    endHour: '00:00',
    realStartTime: '',
    realEndTime: '',
    meeting: '',
    topics: [],


    dateInitialDay: '',
    dateInitialMonth: '',
    dateInitialYear: '',

    timeInitialHour: '',
    timeInitialMinute: '',
    timeFinalHour: '',
    timeFinalMinute: '',

    dateRealInitialDay: '',
    dateRealInitialMonth: '',
    dateRealInitialYear: '',
    dateRealFinalDay: '',
    dateRealFinalMonth: '',
    dateRealFinalYear: '',
    // USUARIOS

    // invitados
    participants: [''], // todos invitados

    assistants: [''], // si asistieron 

    externals: [''], // los externos

    // organizadores
    secretaries: [''],  // secretario
    leaders: [''],     // anfitrion

    number: 0,
    links: [],
    absents: ['']
  };

  isAvailableCreate: boolean = false;
  isAvailableSave: boolean = false;
  meetingMinuteForm!: FormGroup;
  elementForm!: FormGroup;
  elementEditForm!: FormGroup;
  newTopics!: FormControl;
  newParticipants!: FormControl;
  newTopicsDescription!: FormControl;
  newSecretaries!: FormControl;
  newLeaders!: FormControl;
  isAvailableSaving: boolean = false;

  element = {
    description: 'descripcion',
  };
  addSecretaryMember = '';
  selectResponsable = '';
  elements = [
    {
      topic: -1,
      description: ' ',
      type: ' ',
      participants: [' ', ' '],
      id: ' ',
      _id: ' ',
      dateLimit: ' ',
      number: 5,
      position: 0
    },
  ];
  stateMeet = '';
  typesElements = ['compromiso', 'duda', 'acuerdo', 'desacuerdo'];
  user: any;
  isNew = false;
  elementsPreviews: any[] = [''];

  colapseArrayBol: any[] = [true, true, true, true, true, true, true, true, true, true];
  // _________________________________________________________
  // CONSTRUCTOR!
  // _________________________________________________________
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private socket: Socket,
    private modalService: NgbModal
  ) {

    //! AQUI VAMOS SUMANDO A LOS NUEVOS
    socket.fromEvent('new_save').subscribe(async (user: any) => {
      if (user.email === this.user.email) {

      } else {

        this.getMeetingMinute(this.meetingSelectedId);
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
          title: 'Usuario:' + user.email + ' actualizando acta dialógica.',
        })
      }
    });

    //! AQUI VAMOS SUMANDO A LOS NUEVOS
    socket.fromEvent('new_topic').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
       
      } else {
       
        this.topicArr.push(
          new FormControl(this.newTopics.value, Validators.required)
        );
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
          title: 'Usuario:' + user.email + ' creando un nuevo tema.',
        })

      }

    });

    //! BOTON DE AÑADIR UN ELEMENTO

    socket.fromEvent('new_element').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
       
      } else {
      
        this.getMeetingMinute(this.meetingSelectedId);
        let stringAux2 = user.email
        this.getCompromises('noneSoft');
        const Toast = Swal.mixin({
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
          title: 'Usuario:' + user.email + ' añadiendo un nuevo elemento dialógico.',
        })

      }
    });


    // AQUI PARA RECARGAR LA PAGINA
    socket.fromEvent('new_reload').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
        setTimeout(() => {
          location.reload();
        }, 4000);
      
      } else {
        setTimeout(() => {
          location.reload();
        }, 10000);
      

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
          title: 'Usuario:' + user.email + ' cambiando opciones de sesión. Se reiniciará la página web.',
        })
      }
    });

    this.authService.userLogin().subscribe(
      async (resp) => {
        this.user = resp;

        this.getUserProfile(this.user.id);
        this.route.params.subscribe((params: Params) => {
          this.projectSelectedId = params['idP'];
          this.meetingSelectedId = params['idM'];
          // _________________________________________________________
          // LUEGO DE QUE SABEMOS CUAL ES EL USUARIO, REVISAMOS EL ESTADO DE LA REUNION POR LOS PARAMETROS URL
          // _________________________________________________________
          this.authService.stateMeeting(params['idM']).subscribe(
            (resp: any) => {

              this.authService.projectById(this.projectSelectedId).subscribe(
                async (resp) => {
                  /*    console.log(resp); */
                  this.projectSelected = resp;
                  /*     console.log("RESPUESTA FECHA!: ", resp); */

                  /* this.router.navigateByUrl('/main/add-project'); */


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
                  Swal.fire('Error', err.message, 'error');
                }
              );


              // _________________________________________________________
              // DEPENDIENDO DEL ESTASDO ES QUE SE HABILITAN ALGUNOS BOTONES O NO
              // _________________________________________________________
              this.MeetingMinuteSelected.number = resp.number;

              this.stateMeet = resp.state;
              if (resp.state === 'pre-meeting') {
                const url2 =
                  '/main/' +
                  this.projectSelectedId +
                  '/meeting/' +
                  this.meetingSelectedId +
                  '/pre-meeting';
                /*           this.router.navigateByUrl(url2); */
                this.isAvailableSaving = true;

              }

              if (resp.state === 'in-meeting') {
                const url2 =
                  '/main/' +
                  this.projectSelectedId +
                  '/meeting/' +
                  this.meetingSelectedId +
                  '/in-meeting';
                /*       this.router.navigateByUrl(url2); */
                this.isAvailableDialog = true;
                this.isAvailableSaving = true;

                /*           console.log('esta permitido?', this.isAvailableDialog); */
              }
              if (resp.state === 'post-meeting') {
                const url2 =
                  '/main/' +
                  this.projectSelectedId +
                  '/meeting/' +
                  this.meetingSelectedId +
                  '/post-meeting';
                /*       this.router.navigateByUrl(url2); */
                this.isAvailableDialog = false;
                this.isAvailableSaving = false;
                /*                 console.log('esta permitido?', this.isAvailableDialog); */
              }
              if (resp.state === 'new') {
                this.isAvailableSaving = true;
                this.isNew = true;

              }
              /*   console.log(
                'TIENE UN ESTADO ASOCIADO A EL ACTA QUE SE ESTA SOLICITANDO?',
                resp.state
              ); */
              this.getMeetingMinute2(this.meetingSelectedId);

              // _________________________________________________________
              // FINALMENTE SE OBTIENEN LOS COMPROMISOS PREVIOS Y ES TODO
              // _________________________________________________________
              this.getCompromisesPreviews();
              setTimeout(() => {
                this.getCompromises('noneSoft');
              }, 1000);



            },
            (err: string | undefined) => {
              /*           Swal.fire('Error', err, 'error'); */
            }
          );
        });
      },
      (err) => {
        // _________________________________________________________
        // ERROR EN CASO DE QUE NO SE A LOGEADO
        // _________________________________________________________
        if (err.status === 401) {
          this.user = 'noLogin';
          this.router.navigateByUrl('auth/login');

          Swal.fire({
            title: 'Autentificarse en la plataforma antes de ingresar a la reunión.',
            text: "",
            icon: 'info',

          }

          )
        }
      }
    );

  }
  // _________________________________________________________
  // NG ON
  // _________________________________________________________
  ngOnInit(): void {
    this.rellenarListasPrueba();



    // _________________________________________________________
    // PRIMERO SABEMOS CUAL ES EL USUARIO?
    // _________________________________________________________

    // _________________________________________________________
    // PRIMERA OBTENCION DEL ACTA DIALOGICA -> |||| NUMERACION |||||
    // _________________________________________________________

    // _________________________________________________________
    // EL FORMULARIO

    // _________________________________________________________
    this.meetingMinuteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      place: ['', [Validators.required, Validators.minLength(6)]],
      fechaI: ['', []],
      dateInitialDay: ['', []],
      dateInitialMonth: ['', []],
      dateInitialYear: ['', []],
      fechaT: ['', []],
      startHour: ['', []],
      timeInitialHour: ['', []],
      timeInitialMinute: ['', []],
      endHour: ['', []],
      timeFinalHour: ['', []],
      timeFinalMinute: ['', []],
      topics: this.fb.array([], Validators.required),
      participants: this.fb.array([], Validators.required),
      secretaries: this.fb.array([], Validators.required),
      leaders: this.fb.array([], Validators.required),
    });

    this.elementForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(6)]],
      type: ['compromiso', [Validators.required, Validators.minLength(6)]],
      participants: ['', []],
      topic: ['', []],
      number: ['', []],
      dateLimit: ['', []],
      timeLimit: ['', []],
    });

    this.elementEditForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(6)]],
      type: ['', [Validators.required, Validators.minLength(6)]],
      participants: ['', []],
      topic: ['', []],
      number: ['', []],
      dateLimit: ['', []],
      timeLimit: ['', []],
    });



    this.newTopics = this.fb.control('', Validators.required);
    this.newParticipants = this.fb.control('', Validators.required);
    this.newTopicsDescription = this.fb.control('', Validators.required);
    this.newSecretaries = this.fb.control('', Validators.required);
    this.newLeaders = this.fb.control('', Validators.required);

  }

  /* FUNICONES */




  campoEsValido(campo: string) {
    if (this.meetingMinuteForm.controls[campo].touched) {
      this.meetingMinuteForm.markAsUntouched();
      setTimeout(() => {
        this.saveMeetingMinute();
      }, 1000);
    }
  }

  agregarTopic() {
    if (this.newTopics.invalid) {
      return;
    }
    this.topicArr.push(
      new FormControl(this.newTopics.value, Validators.required)
    );
    this.newTopics.reset();
  }

  agregarParticipant() {
    if (this.newParticipants.invalid) {
      return;
    }
    this.participantArr.push(
      new FormControl(this.newParticipants.value, Validators.required)
    );
    this.newParticipants.reset();
  }

  async agregarParticipant2() {
    await Swal.fire({
      title: 'Agregar un nuevo invitado',
      input: 'select',
      inputOptions: {
        'Miembros del proyecto': this.projectSelected.userMembers,
      },
      inputPlaceholder: 'Seleccionar un nuevo invitado',
      showCancelButton: true,
      confirmButtonText: 'Añadir como invitado',
      showDenyButton: true,
      denyButtonText: `Añadir invitado externo`,
      denyButtonColor: 'rgb(105, 152, 92)',
      preConfirm: (emailMember) => {
        this.addSecretaryMember = emailMember;
        console.log('EMAIL: ', emailMember);

        this.createParticipant(this.projectSelected.userMembers[emailMember]);
        /*         this.createMember(emailMember, this.projectSelected._id); */
      },
    }).then((result) => {
      if (result.isConfirmed) {

      } else if (result.isDenied) {
        Swal.fire({
          title: 'Añadir un nuevo invitado externo',
          text: '¿Email de la persona para invitar?',
          input: 'email',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Añadir como invitado externo',

          showLoaderOnConfirm: true,
          showDenyButton: false,
          denyButtonText: `Añadir como Secretario`,
          preConfirm: (emailMember) => {
            console.log('EMAIL: ', emailMember);
            this.createParticipant(emailMember);
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
          } else if (result.isDenied) {

            console.log('RESULTADO ROJO', result);
          }
        });
      }
    });
  }

  async agregarSecretary2() {
    await Swal.fire({
      title: 'Agregar un nuevo usuario',
      input: 'select',
      inputOptions: {
        'Miembros del proyecto': this.projectSelected.userMembers,
      },
      inputPlaceholder: 'Seleccionar un nuevo secretario',
      showCancelButton: true,
      confirmButtonText: 'Añadir como Secretario',
      showDenyButton: true,
      denyButtonColor: 'rgb(105, 152, 92)',
      denyButtonText: `Ingresar usuario secretario manualmente`,
      preConfirm: (emailMember) => {
        this.addSecretaryMember = emailMember;
        console.log('EMAIL: ', emailMember);
        this.createSecretary(this.projectSelected.userMembers[emailMember]);
        /*         this.createMember(emailMember, this.projectSelected._id); */
      },
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Equipo de proyecto',
          text: '¿Email del usuario?',
          input: 'email',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Añadir como Secretario',

          showLoaderOnConfirm: true,
          showDenyButton: false,
          denyButtonText: `Añadir como Secretario`,
          preConfirm: (emailMember) => {
            console.log('EMAIL: ', emailMember);
            this.createSecretary(emailMember);
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
          } else if (result.isDenied) {
            console.log('RESULTADO ROJO', result);
          }
        });
      }
    });

  }

  agregarTema2() {
    Swal.fire({
      title: 'Añadir Tema',
      text: '¿Cuál es la descripción del tema? ',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Crear tema',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      denyButtonText: `Añadir como Secretario`,
      preConfirm: (topic) => {
        console.log('TOPIC: ', topic);
        this.topicArr.push(
          new FormControl(topic)
        );
        setTimeout(() => {
          this.saveMeetingMinute();
          let payloadSave = {
            room: this.meetingSelectedId,
            user: this.user
          }
          this.socket.emit('event_topic', payloadSave);
        }, 1000);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        console.log('RESULTADO ROJO', result);
      }
    });
  }

  createSecretary(emailMember: string) {
    this.authService.getUserByEmail(emailMember).subscribe(
      (resp) => {
        console.log(
          'EDIT_PROYECT respuesta de si es que hay un email con eso',
          resp
        );
        /*         this.listProjectsInicial(); */
        if (resp === null) {
          Swal.fire({
            title:
              'El correo electrónico ingresado no pertenece a ningún usuario de la plataforma.',
            icon: 'error',
          });

        } else {
          this.secretaryArr.push(new FormControl(emailMember));
          this.MeetingMinuteSelected.secretaries = [emailMember];
          this.saveMeetingMinute();
          setTimeout(() => {

            let payloadSave = {
              room: this.meetingSelectedId,
              user: this.user
            }
            this.socket.emit('event_reload', payloadSave);
            location.reload();
          }, 2000);

        }
      },
      (err: any) => {
        /*    console.log(err); */
        Swal.fire('Error NO HAY USUARIO', err.message, 'error');
      }
    );
    /*     this.favoritosArr.push(
      this.fb.control(this.nuevoFavorito.value, Validators.required)
    ); */
  }

  createParticipant(emailMember: string) {
    this.authService.getUserByEmail(emailMember).subscribe(
      (resp) => {
        console.log(
          'EDIT_PROYECT respuesta de si es que hay un email con eso',
          resp
        );

        /*         this.listProjectsInicial(); */
        if (resp === null) {

          Swal.fire({
            title:
              'Se ha enviado una invitación al correo: ' + emailMember,
            icon: 'success',
          });

          this.MeetingMinuteSelected.externals.push(emailMember);


          setTimeout(() => {
            this.notificarInvitadosExternos('pre-meeting', emailMember);
            this.saveMeetingMinute();
          }, 2000);


        } else {
          this.MeetingMinuteSelected.participants.push(emailMember);
          this.saveMeetingMinute();
          setTimeout(() => {
            let payloadSave = {
              room: this.meetingSelectedId,
              user: this.user
            }
            this.socket.emit('event_reload', payloadSave);
            location.reload();
          }, 2000);

        }
      },
      (err: any) => {
        /*    console.log(err); */
        Swal.fire('Error NO HAY USUARIO', err.message, 'error');
      }
    );
    /*     this.favoritosArr.push(
      this.fb.control(this.nuevoFavorito.value, Validators.required)
    ); */
  }

  createParticipantExternal(emailMember: string) {
    this.authService.getUserByEmail(emailMember).subscribe(
      (resp) => {
        console.log(
          'EDIT_PROYECT respuesta de si es que hay un email con eso',
          resp
        );
        /*         this.listProjectsInicial(); */
        if (resp === null) {

          Swal.fire({
            title:
              'Se ha enviado una invitación al correo: ' + emailMember,
            icon: 'success',
          });

          this.MeetingMinuteSelected.externals.push(emailMember);
          this.saveMeetingMinute();

          /*       setTimeout(() => {
                  let payloadSave = {
                    room: this.meetingSelectedId,
                    user: this.user
                  }
                  this.socket.emit('event_reload', payloadSave);
                  location.reload();
                }, 2000); */


        } else {
          this.MeetingMinuteSelected.externals.push(emailMember);
          this.saveMeetingMinute();
          setTimeout(() => {
            let payloadSave = {
              room: this.meetingSelectedId,
              user: this.user
            }
            this.socket.emit('event_reload', payloadSave);
            location.reload();
          }, 2000);

        }
      },
      (err: any) => {
        /*    console.log(err); */
        Swal.fire('Error NO HAY USUARIO', err.message, 'error');
      }
    );
    /*     this.favoritosArr.push(
      this.fb.control(this.nuevoFavorito.value, Validators.required)
    ); */
  }

  agregarSecretary() {
    if (this.newSecretaries.invalid) {
      return;
    }
    /*     this.favoritosArr.push(
      this.fb.control(this.nuevoFavorito.value, Validators.required)
    ); */

    this.secretaryArr.push(
      new FormControl(this.newSecretaries.value, Validators.required)
    );
    this.newSecretaries.reset();
  }

  borrarTema(id: number) {

    Swal.fire({
      title: '¿Eliminar tema?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar tema',
      denyButtonText: `No`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.borrar(id);
      } else if (result.isDenied) {

      }
    })
  }


  borrar(id: number) {
    this.topicArr.removeAt(id);
    let payloadSave = {
      room: this.meetingSelectedId,
      user: this.user
    }
    this.saveMeetingMinute();
    this.socket.emit('event_reload', payloadSave);
  }
  borrar2(id: number) {
    this.participantArr.removeAt(id);
    let payloadSave = {
      room: this.meetingSelectedId,
      user: this.user
    }
    this.saveMeetingMinute();
    this.socket.emit('event_reload', payloadSave);
  }

  borrar3(id: number) {
    /*     console.log('NUMEROOOOOO: ', id); */
    if (id >= 0) {
      this.secretaryArr.removeAt(id);
      let payloadSave = {
        room: this.meetingSelectedId,
        user: this.user
      }
      this.saveMeetingMinute();
      this.socket.emit('event_reload', payloadSave);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe haber al menos un secretario en la reunión',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  borrar4(id: number) {
    if (id >= 0) {
      this.leaderArr.removeAt(id);
      let payloadSave = {
        room: this.meetingSelectedId,
        user: this.user
      }
      this.saveMeetingMinute();
      this.socket.emit('event_reload', payloadSave);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe haber al menos un anfitrón en la reunión',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  get topicArr() {
    return this.meetingMinuteForm.get('topics') as FormArray;
  }

  get participantArr() {
    return this.meetingMinuteForm.get('participants') as FormArray;
  }

  get secretaryArr() {
    return this.meetingMinuteForm.get('secretaries') as FormArray;
  }

  get leaderArr() {
    return this.meetingMinuteForm.get('leaders') as FormArray;
  }

  async setModification(id: number, user: any, roleUser: string) {
    const { value: modification } = await Swal.fire({
      title: 'Asignar rol del usuario',
      input: 'select',
      inputOptions: {
        Permisos: {
          secretario: 'Asignar rol de secretario',
          /*   participante: 'Asignar rol de participante', */
          lider: 'Asignar rol de anfitrion',
          eliminar: 'Desvincular de la reunión',
        },
      },
      inputPlaceholder: 'Seleccionar nivel de permisos del usuario',
      showCancelButton: true,
    });

    if (modification != 'eliminar') {
      this.setRoleUser(id, user, modification, roleUser);
    }
    if (modification === 'eliminar') {
      let pos = this.MeetingMinuteSelected.participants.indexOf(user.email);
      this.MeetingMinuteSelected.participants.splice(pos, 1);
      setTimeout(() => {
        this.saveMeetingMinute();
        /*  this.socket.emit('event_reload', payloadSave); */
        /* location.reload(); */
      }, 2000);
    }
  }

  async setRoleUser(
    id: number,
    user: string,
    modification: string,
    roleUser: string
  ) {
    if (roleUser === modification) {
      Swal.fire(`Usuario ${user}  ya tiene el rol de ${modification}`);
    } else {
      if (modification === 'secretario') {
        /*     this.secretaryArr.push(
              new FormControl(user)
            ); */

        /*    this.MeetingMinuteSelected.secretaries = [' ']; */
        /*      this.leaderArr.push(new FormControl(user)); */
        this.MeetingMinuteSelected.secretaries = [user];
        this.saveMeetingMinute();
        /*       if (roleUser === 'participante') {
                this.participantArr.removeAt(id);
              }
              if (roleUser === 'lider') {
                this.leaderArr.removeAt(id);
              } */
        /*     if (this.isSecretary && !this.isLeader) {
              this.MeetingMinuteSelected.participants.push(this.user.email);
            } */
        let payloadSave = {
          room: this.meetingSelectedId,
          user: this.user
        }

        setTimeout(() => {

          this.socket.emit('event_reload', payloadSave);
          location.reload();
        }, 2000);
      }
      if (modification == 'participante') {
        this.participantArr.push(
          new FormControl(user)
        );
        if (roleUser === 'secretario') {
          this.secretaryArr.removeAt(id);
        }
        if (roleUser === 'lider') {
          this.leaderArr.removeAt(id);
        }
        let payloadSave = {
          room: this.meetingSelectedId,
          user: this.user
        }
        this.saveMeetingMinute();
        setTimeout(() => {


          this.socket.emit('event_reload', payloadSave);
          location.reload();
        }, 2000);
      }
      if (modification == 'lider') {
        this.MeetingMinuteSelected.leaders = [user];
        this.saveMeetingMinute();
        /*     this.leaderArr.push(
              new FormControl(user)
            ); */
        /*       if (roleUser === 'secretario') {
                this.secretaryArr.removeAt(id);
              }
              if (roleUser === 'participante') {
                this.participantArr.removeAt(id);
              } */
        let payloadSave = {
          room: this.meetingSelectedId,
          user: this.user
        }

        setTimeout(() => {


          this.socket.emit('event_reload', payloadSave);
          location.reload();
        }, 2000);
      }
    }
  }

  getMeetingMinute(meetingSelectedId: string) {
    /*     console.log('MEETING MINUTE', meetingSelectedId); */


    this.authService.getMeetingMinute(this.meetingSelectedId).subscribe(
      async (resp) => {
        console.log('[MEETING MINUTE] FUNCION getMeetingMinute() : ', resp);

        if (resp.length === 0) {
          console.log("[CONTROLLER MEETINGMINUTE: GET_MEETINGMINUTE] repusta SI largo === 0 : ", resp);
          this.authService
            .addMeetingMinute(
              this.meetingSelectedId,
              '',
              '',
              '',
              this.MeetingMinuteSelected.number
            )
            .subscribe(
              async (resp) => {
                /*      console.log('RESPUESTA', resp); */
                /*   console.log('RESPUESTA id', resp.id); */
                /* this.router.navigateByUrl('/main/add-project'); */
                this.isAvailableCreate = false;
                this.isAvailableSave = true;
                this.participantArr.push(
                  new FormControl(
                    this.MeetingMinuteSelected.participants[0],
                    Validators.required
                  )
                );
                this.secretaryArr.push(
                  new FormControl(
                    this.MeetingMinuteSelected.secretaries[0],
                    Validators.required
                  )
                );

                /*               const Toast = Swal.mixin({
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
                                title: 'Se ha creado el acta exitosamente.'
                              }) */
                /*         this.meetingMinuteForm.reset(); */
                setTimeout(() => {
                  this.getMeetingMinute(this.meetingSelectedId);
                }, 1000);
              },
              (err: { message: string | undefined }) => { }
            );
        } else {
          console.log("[CONTROLLER MEETINGMINUTE: GET_MEETINGMINUTE] repusta SI largo != 0 : ", resp);
          const { name, place, fechaI, fechaT, topics } = resp;
          /* console.log('RESPUESTA', resp); */
          this.MeetingMinuteSelected.name = resp[0].title;
          this.MeetingMinuteSelected.place = resp[0].place;
          this.MeetingMinuteSelected.fechaI = resp[0].startTime;
          this.MeetingMinuteSelected.fechaT = resp[0].endTime;
          this.MeetingMinuteSelected.topics = resp[0].topics;
          this.MeetingMinuteSelected.participants = resp[0].participants;
          this.MeetingMinuteSelected.secretaries = resp[0].secretaries;
          this.MeetingMinuteSelected.id = resp[0]._id;
          this.MeetingMinuteSelected.startHour = resp[0].startHour;
          this.MeetingMinuteSelected.endHour = resp[0].endHour;
          this.MeetingMinuteSelected.links = resp[0].links;
          this.MeetingMinuteSelected.realEndTime = resp[0].realEndTime;
          this.MeetingMinuteSelected.realStartTime = resp[0].realStartTime;
          this.MeetingMinuteSelected.externals = resp[0].externals;


          // FECHA INGRESADA ES SUBDIVIDIDA EN DIA MES Y AÑO POR SEPARADO

          let dateInitial = this.MeetingMinuteSelected.fechaI;
          this.MeetingMinuteSelected.dateInitialDay = dateInitial.split('-')[0] + '';
          this.MeetingMinuteSelected.dateInitialMonth = dateInitial.split('-')[1] + '';
          this.MeetingMinuteSelected.dateInitialYear = dateInitial.split('-')[2] + '';




          // HORA INGRESADA ES SUBDIVIDIDA EN HORAS Y MINUTOS

          let timeInitial = this.MeetingMinuteSelected.startHour;
          this.MeetingMinuteSelected.timeInitialHour = timeInitial.split(':')[0] + '';
          this.MeetingMinuteSelected.timeInitialMinute = timeInitial.split(':')[1] + '';

          let timeFinal = this.MeetingMinuteSelected.endHour;
          this.MeetingMinuteSelected.timeFinalHour = timeFinal.split(':')[0] + '';
          this.MeetingMinuteSelected.timeFinalMinute = timeFinal.split(':')[1] + '';



          console.log("[CONTROLLER MEETINGMINUTE: getMeetingMinute2] ESTA ES EL ACTA OBTENIDA: ", resp);
          console.log("[CONTROLLER MEETINGMINUTE: getMeetingMinute2] dia: ", this.MeetingMinuteSelected.dateInitialDay);
          console.log("[CONTROLLER MEETINGMINUTE: getMeetingMinute2] dia: ", this.MeetingMinuteSelected.dateInitialMonth);
          console.log("[CONTROLLER MEETINGMINUTE: getMeetingMinute2] dia: ", this.MeetingMinuteSelected.dateInitialYear);
          this.links = resp[0].links;



          /*  console.log(
            'RESPUESTA DE MEETING MINUTE',
            this.MeetingMinuteSelected
          ); */
          /* console.log('PARTICIPANTES', this.MeetingMinuteSelected.participants); */
          this.isAvailableCreate = false;
          this.isAvailableSave = true;
          this.meetingMinuteForm.patchValue(this.MeetingMinuteSelected);
          let i = 0;
          /*  console.log(
            'CUENTA TOPICOS:',
            this.MeetingMinuteSelected.topics.length
          ); */

          while (i < this.MeetingMinuteSelected.topics.length - 1000) {
            this.topicArr.push(
              new FormControl(
                this.MeetingMinuteSelected.topics[i],
                Validators.required
              )
            );
            i++;
          }

          let x = 0;

          while (x < this.MeetingMinuteSelected.participants.length - 1000) {
            this.participantArr.push(
              new FormControl(
                this.MeetingMinuteSelected.participants[x],
                Validators.required
              )
            );
            x++;
          }

          let f = 0;
          while (f - 1 < this.MeetingMinuteSelected.secretaries.length - 1000) {
            this.secretaryArr.push(
              new FormControl(
                this.MeetingMinuteSelected.secretaries[f],
                Validators.required
              )
            );
            f++;
          }

          let l = 0;
          while (l < this.MeetingMinuteSelected.leaders.length - 1000) {
            this.leaderArr.push(
              new FormControl(
                this.MeetingMinuteSelected.leaders[l],
                Validators.required
              )
            );
            l++;
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

          if (
            this.MeetingMinuteSelected.secretaries.length === 1 &&
            this.first
          ) {
            this.first = false;
            /*          this.secretaryArr.push(
                       new FormControl(
                         this.MeetingMinuteSelected.secretaries[0],
                         Validators.required
                       )
                     ); */
          }

          let result = this.MeetingMinuteSelected.secretaries.filter((role) =>
            role.includes(this.user.email)
          );
          let result2 = this.MeetingMinuteSelected.leaders.filter((role) =>
            role.includes(this.user.email)
          );
          let result3 = this.MeetingMinuteSelected.participants.filter((role) =>
            role.includes(this.user.email)
          );

          /*  console.log("RESULTADO!", result.length); */

          // Es secretario
          if (result.length > 0) {
            this.isSecretary = true;
            this.isLeader = false;
            this.isParticipant = true;
          }
          // ES lider
          else if (result2.length > 0) {
            this.isSecretary = true;
            this.isLeader = true;
            this.isParticipant = true;
          }
          // ES solo participante
          else if (result3.length > 0) {
            this.isParticipant = true;
            this.isSecretary = false;
          } else {
            this.isParticipant = false;
            this.isSecretary = false;
          }
        }, 1000);
      },
      (err: { message: string | undefined }) => { }
    );
  }

  // _________________________________________________________
  // |||| NUMERACION  1  ||||| -> ESTO ES LO PRIMERO QUE HACE LA WEA PARA OBTENER ACTA
  // _________________________________________________________
  getMeetingMinute2(meetingSelectedId: string) {
    // _________________________________________________________
    //  BUSCAMOS EL ACTA EN BASE A LA REUNION SELECCIONADA
    // _________________________________________________________
    this.authService.getMeetingMinute(this.meetingSelectedId).subscribe(
      async (resp) => {
        console.log('[MEETING MINUTE] FUNCION getMeetingMinute2() : ', resp);
        // _________________________________________________________
        // SI NO HAY ACTA DIALOGICA ASOCIADA A LA REUNION ENTONCES LA CREAMOS
        // _________________________________________________________

        if (resp.length === 0) {

          // SI NO ES LA PRIMERA REUNION, ENTONCES OBTENEMOS LOS ANTERIORES JEFES
          if (this.MeetingMinuteSelected.number > 0) {
            // EL NUMERO DE LA REUNION ES 1 O SUPERIOR, 
            // ENTONCFES TENEMOS QUE BUSCAR LA ACTA DE LA REUNION 1 o SUPERIOR - 1

            this.authService
              .getMeetByProjectNumber(
                this.projectSelectedId,
                this.MeetingMinuteSelected.number - 1
              )
              .subscribe(
                async (resp) => {

                  // LA REUNION PASADA ES: 

                  console.log("[CONTROLLER MEETINGMINUTE: GET_MEETINGMINUTE2] obtenemos una reunion segun idProject y number: ", resp);
                  console.log("[CONTROLLER MEETINGMINUTE: GET_MEETINGMINUTE2] id meet: ", resp[0]._id);
                  // AHORA QUE YA TENEMOS LA REUNION PASADA, 
                  // PODEMOS OBTENER LA MEETING MINUTE PASADA,
                  // Y ASI OBTENER LOS JEFES
                  await this.authService
                    .getMeetingMinute(
                      resp[0]._id
                    )
                    .subscribe(
                      async (meetingMinuteAnterior) => {

                        console.log("[CONTROLLER MEETINGMINUTE: GET_MEETINGMINUTE2] obtenemos la meeting minute pasada: ", meetingMinuteAnterior);

                        this.authService
                          .addMeetingMinuteLastConfig(
                            this.meetingSelectedId,
                            '',
                            '',
                            '',
                            this.MeetingMinuteSelected.number,
                            meetingMinuteAnterior[0].secretaries,
                            meetingMinuteAnterior[0].leaders,
                            meetingMinuteAnterior[0].participants
                          )
                          .subscribe(
                            async (resp) => {
                              this.isAvailableCreate = false;
                              this.isAvailableSave = true;
                              setTimeout(() => {
                                this.getMeetingMinute2(this.meetingSelectedId);
                              }, 2000);
                            },
                            (err: { message: string | undefined }) => {
                              console.log('NO SE PUDO CREAR EL ACTA DIALOGICA');
                            }
                          );



                      },
                      (err: { message: string | undefined }) => {
                        console.log('NO SE PUDO CREAR EL ACTA DIALOGICA');
                      }
                    );


                },
                (err: { message: string | undefined }) => {
                  console.log('NO SE PUDO CREAR EL ACTA DIALOGICA');
                }
              );




          } else {
            console.log("[CONTROLLER MEETINGMINUTE: GET_MEETINGMINUTE_2] repusta SI largo === 0 : ", resp);

            this.authService
              .addMeetingMinuteLastConfig(
                this.meetingSelectedId,
                '',
                '',
                '',
                this.MeetingMinuteSelected.number,
                [this.user.email],
                [this.user.email],
                this.projectSelected.members
              )
              .subscribe(
                async (resp) => {
                  this.isAvailableCreate = false;
                  this.isAvailableSave = true;
                  setTimeout(() => {
                    this.getMeetingMinute2(this.meetingSelectedId);
                  }, 2000);
                },
                (err: { message: string | undefined }) => {
                  console.log('NO SE PUDO CREAR EL ACTA DIALOGICA');
                }
              );

          }


        } else {
          console.log("[CONTROLLER MEETINGMINUTE: GET_MEETINGMINUTE_2] repusta SI largo != 0 : ", resp);
          this.MeetingMinuteSelected.name = resp[0].title;
          this.MeetingMinuteSelected.place = resp[0].place;
          this.MeetingMinuteSelected.fechaI = resp[0].startTime;
          this.MeetingMinuteSelected.fechaT = resp[0].endTime;
          this.MeetingMinuteSelected.startHour = resp[0].startHour;

          this.MeetingMinuteSelected.endHour = resp[0].endHour;
          this.MeetingMinuteSelected.topics = resp[0].topics;
          this.MeetingMinuteSelected.participants = resp[0].participants;
          this.MeetingMinuteSelected.secretaries = resp[0].secretaries;
          this.MeetingMinuteSelected.leaders = resp[0].leaders;
          this.MeetingMinuteSelected.id = resp[0]._id;
          this.MeetingMinuteSelected.realEndTime = resp[0].realEndTime;
          this.MeetingMinuteSelected.realStartTime = resp[0].realStartTime;

          this.MeetingMinuteSelected.externals = resp[0].externals;
          /* this.MeetingMinuteSelected.externals.push(resp[0].externals); */

          this.MeetingMinuteSelected.assistants = resp[0].assistants;

          // FECHA INGRESADA ES SUBDIVIDIDA EN DIA MES Y AÑO POR SEPARADO

          let dateInitial = this.MeetingMinuteSelected.fechaI;
          this.MeetingMinuteSelected.dateInitialDay = dateInitial.split('-')[0] + '';
          this.MeetingMinuteSelected.dateInitialMonth = dateInitial.split('-')[1] + '';
          this.MeetingMinuteSelected.dateInitialYear = dateInitial.split('-')[2] + '';


          /* let dateRealInitial = this.MeetingMinuteSelected.realStartTime;
          this.MeetingMinuteSelected.dateRealInitialDay = dateRealInitial.split('-')[1] + '';
          this.MeetingMinuteSelected.dateRealInitialMonth = dateRealInitial.split('-')[0] + '';
          this.MeetingMinuteSelected.dateRealInitialYear = dateRealInitial.split('-')[2] + '';

          let dateRealFinal = this.MeetingMinuteSelected.realEndTime;
          this.MeetingMinuteSelected.dateRealFinalDay = dateRealFinal.split('-')[1] + '';
          this.MeetingMinuteSelected.dateRealFinalMonth = dateRealFinal.split('-')[0] + '';
          this.MeetingMinuteSelected.dateRealFinalYear = dateRealFinal.split('-')[2] + ''; */

          // HORA INGRESADA ES SUBDIVIDIDA EN HORAS Y MINUTOS

          let timeInitial = this.MeetingMinuteSelected.startHour;
          this.MeetingMinuteSelected.timeInitialHour = timeInitial.split(':')[0] + '';
          this.MeetingMinuteSelected.timeInitialMinute = timeInitial.split(':')[1] + '';

          let timeFinal = this.MeetingMinuteSelected.endHour;
          this.MeetingMinuteSelected.timeFinalHour = timeFinal.split(':')[0] + '';
          this.MeetingMinuteSelected.timeFinalMinute = timeFinal.split(':')[1] + '';


          this.links = resp[0].links;
          this.isAvailableCreate = false;
          this.isAvailableSave = true;
          this.meetingMinuteForm.patchValue(this.MeetingMinuteSelected);


          let time1: Date;
          let time2: Date;
          time1 = new Date(this.MeetingMinuteSelected.realEndTime);
          time2 = new Date(this.MeetingMinuteSelected.realStartTime);
          let time1Number = time1[Symbol.toPrimitive]('number');
          let time2Number = time2[Symbol.toPrimitive]('number');

          let restaTime1Time2 = time1Number - time2Number;
          let horas1 = restaTime1Time2 / 60;
          let minutos1 = (restaTime1Time2 / 60000);

          console.log("TIEMPO START ", time1);
          console.log("TIEMPO END ", time2);
          console.log("TIEMPO START NUMERICO", time1Number);
          console.log("TIEMPO END NUMERICO", time2Number);
          console.log("TIEMPO RESTA ", restaTime1Time2);
          console.log("TIEMPO DURACION HORAS ", horas1);
          this.durationRealMeeting = Math.round(minutos1);

          /*    console.log("TIEMPO STARTHOUR ", this.MeetingMinuteSelected.startHour );
             console.log("TIEMPO ENDHOUR ", this.MeetingMinuteSelected.endHour ); */
          console.log("ESTA ES EL ACTA OBTENIDA: ", resp);
          // ENLISTAMOS LOS TEMAS
          let i = 0;
          while (i < this.MeetingMinuteSelected.topics.length) {
            this.topicArr.push(
              new FormControl(
                this.MeetingMinuteSelected.topics[i],
                Validators.required
              )
            );
            i++;
          }


        }
        // ESPERAMOS 1 segundo
        setTimeout(() => {
          // PARA LA PRIMERA VEZ QUE SE OBTIENE EL ACTA DIALOGICA

          // ASIGNAMOS LOS NIVELES DE ACCESO SEGUN EL ROL
          let result = this.MeetingMinuteSelected.secretaries.filter((role) =>
            role.includes(this.user.email)
          );
          let result2 = this.MeetingMinuteSelected.leaders.filter((role) =>
            role.includes(this.user.email)
          );
          let result3 = this.MeetingMinuteSelected.participants.filter((role) =>
            role.includes(this.user.email)
          );


          // SECTOR DE ASISTENTES
          let result4 = this.MeetingMinuteSelected.assistants.filter((role) =>
            role.includes(this.user.email)
          );

          // SI ESTAMOS EN LA FASE DE IN-MEETING SIGNIFICA QUE YA SOMOS ASISTENTES
          if (this.stateMeet === 'in-meeting') {
            // SI ESTOY EN ASISTENTES
            if (result4.length > 0) {
              // NO HACEMOS NADA
            }
            // SI NO ESTOY EN ASISTENTES
            else {
              // NOS AÑADIMOS COMO ASISNTENTE
              this.MeetingMinuteSelected.assistants.push(this.user.email);

              // ESPERAMOS A QUE SE AÑADA Y LUEGO PUM ACTUALIZAMOS LA BASE DE DATOS
              setTimeout(() => {
                this.saveMeetingMinute();
              }, 4000);
            }
          }

          // AQUI CALCULAMOS QUIENES FUERON Y QUIENES FALTARON
          if (this.stateMeet === 'post-meeting' || this.stateMeet === 'finish') {

            let auxe1 = 0;
            const cantParticipants = this.MeetingMinuteSelected.participants.length
            while (auxe1 < cantParticipants) {
              let participant = this.MeetingMinuteSelected.participants[auxe1];

              // PARTICIPANTE ESTA INCLUIDO EN ASISTENTE?
              let result5 = this.MeetingMinuteSelected.assistants.filter((role) =>
                role.includes(participant)
              );


              console.log("PARTICIPANTE AUSENTE1 : ", participant);
              if (result5.length === 0) {
                console.log("PARTICIPANTE AUSENTE: ", participant);
                this.MeetingMinuteSelected.absents.push(participant);
              }
              auxe1++;
            }
          }



          // Es secretario
          if (result.length > 0) {
            this.isSecretary = true;
            this.isLeader = false;
            this.isParticipant = true;
          }
          // ES lider
          else if (result2.length > 0) {
            this.isSecretary = true;
            this.isLeader = true;
            this.isParticipant = true;
          }
          // ES solo participante
          else if (result3.length > 0) {
            this.isParticipant = true;
            this.isSecretary = false;
          } else {
            this.isParticipant = false;
            this.isSecretary = false;
          }
        }, 1000);
      },
      (err: { message: string | undefined }) => { }
    );
  }

  addMeetingMinute() {
    let { name, place, fechaI, fechaT, startHour, endHour, topics, artifact, mode, responsible } =
      this.meetingMinuteForm.value;
    /*  console.log(name);
    console.log(place);
    console.log(fechaI);
    console.log(fechaT);
    console.log('TEMAS', topics); */

    this.authService
      .addMeetingMinute(
        this.meetingSelectedId,
        name,
        place,
        topics,
        this.MeetingMinuteSelected.number
      )
      .subscribe(
        async (resp) => {
          /*  console.log('RESPUESTA', resp);
          console.log('RESPUESTA 2', resp.topics); */
          /* this.router.navigateByUrl('/main/add-project'); */
          this.isAvailableCreate = false;
          this.isAvailableSave = true;
          this.getMeetingMinute(this.meetingSelectedId);

          /*      const Toast = Swal.mixin({
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
                 title: 'Se ha creado el acta exitosamente.'
               }) */
          /*         this.meetingMinuteForm.reset(); */
          setTimeout(() => {
            /*    location.reload(); */
          }, 2000);
        },
        (err: { message: string | undefined }) => { }
      );
  }

  saveMeetingMinute() {
    /* this.getMeetingMinute(this.meetingSelectedId); */


    let { name, place, fechaI, dateInitialDay, dateInitialMonth, dateInitialYear, timeInitialHour, timeInitialMinute, timeFinalHour, timeFinalMinute, fechaT, startHour, endHour, topics, } =
      this.meetingMinuteForm.value;
    /* console.log(name);
    console.log(place);
    console.log(fechaI);
    console.log(fechaT);
    console.log('TEMAS', topics); */

    fechaI = dateInitialDay + '-' + dateInitialMonth + '-' + dateInitialYear;
    startHour = timeInitialHour + ':' + timeInitialMinute;
    endHour = timeFinalHour + ':' + timeFinalMinute;
    console.log("this.MeetingMinuteSelected.realStartTime", this.MeetingMinuteSelected.realStartTime);
    this.authService
      .saveMeetingMinute(
        this.meetingSelectedId,
        this.MeetingMinuteSelected.id,
        name,
        place,
        fechaI,
        fechaT,
        startHour,
        endHour,
        topics,
        this.MeetingMinuteSelected.participants,
        this.MeetingMinuteSelected.secretaries,
        this.MeetingMinuteSelected.leaders,
        this.links,
        this.MeetingMinuteSelected.realStartTime,
        this.MeetingMinuteSelected.realEndTime,
        this.MeetingMinuteSelected.assistants,
        this.MeetingMinuteSelected.externals
      )
      .subscribe(
        async (resp) => {
          /*  console.log('RESPUESTA', resp);
          console.log('RESPUESTA 2', resp.topics); */
          /* this.router.navigateByUrl('/main/add-project'); */
          this.isAvailableCreate = false;
          this.isAvailableSave = true;

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
            title: 'Se ha guardado el acta dialógica exitosamente.'
          })
          let payloadSave = {
            room: this.meetingSelectedId,
            user: this.user
          }
          console.log("ESTADO: ", this.state);
          this.socket.emit('event_save', payloadSave);
          /* this.meetingMinuteForm.reset(); */
          setTimeout(() => {
            /* this.meetingMinuteForm.reset(); */
            this.getMeetingMinute(this.meetingSelectedId);
            this.isEditable = false;
            this.isEditableObjetivo = false;
            this.isEditableLugar = false;
            this.isEditableFecha = false;
            this.isEditableInicio = false;
            this.isEditableTermino = false;
          }, 1000);
        },
        (err: { message: string | undefined }) => { }
      );
  }

  addCompromiso(id: number) {
    /*     console.log('ID: ', id); */

    /*  this.elements.push({uno: id, dos: "adios"}); */

    Swal.fire({
      title: 'Creación de compromiso',
      text: '¿descripcion del compromiso?',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'crear',

      showLoaderOnConfirm: true,
      showDenyButton: true,

      preConfirm: (description) => {
        this.crearCompromiso(description, id);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {

      if (result.isConfirmed) {
      } else if (result.isDenied) {

      }
    });
  }

  crearCompromiso(description: string, id: number) {

    this.authService
      .addCompromise(
        description,
        id,
        this.meetingSelectedId,
        'Compromiso',
        this.projectSelectedId,
        this.MeetingMinuteSelected.number,
        '',
        ''
      )
      .subscribe(
        (resp) => {

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
            title: 'Se ha creado el compromiso exitosamente.'
          })
          this.elements.push({
            topic: id,
            description: description,
            type: 'Compromiso',
            participants: [],
            id: ' ',
            _id: resp._id,
            dateLimit: '',
            number: this.MeetingMinuteSelected.number,
            position: 0
          });

          let payloadSave = {
            room: this.meetingSelectedId,
            user: this.user
          }
          this.socket.emit('event_element', payloadSave);

        },
        (err: any) => {

        }
      );
  }

  crearElemento() {

    let { description, type, participants, topic, number, dateLimit, timeLimit } =
      this.elementForm.value;




    if (dateLimit != null && timeLimit != null && dateLimit != '' && timeLimit != '') {
      let dateLimitAux = dateLimit.split("-")[2] + '-'+ dateLimit.split("-")[1] + '-'+ dateLimit.split("-")[0]; 
      dateLimit = dateLimitAux + ' ' + timeLimit;

    } else if (dateLimit === null && timeLimit != null) {
      dateLimit = ' ' + timeLimit;

    } else if (dateLimit != null && timeLimit === null) {
      let dateLimitAux = dateLimit.split("-")[2] + '-'+ dateLimit.split("-")[1] + '-'+ dateLimit.split("-")[0];
      dateLimit = dateLimitAux + ' ';
    } else if (dateLimit === null && timeLimit === null || dateLimit === '' && timeLimit === '') {
      dateLimit = "Sin fecha";
    }


    if (topic === '' || topic === null) {
      let newTopic = this.selectTopic;

      if (this.selectType === 'textolibre') {

        console.log("TEXTO LIBRO CREANDO");
        console.log("NUEVO TOPIC: ", topic);
        this.authService
          .addCompromise(
            description,
            newTopic,
            this.meetingSelectedId,
            'texto libre',
            this.projectSelectedId,
            this.MeetingMinuteSelected.number,
            this.user.email,
            'Sin fecha limite'
          )
          .subscribe(
            (resp) => {
              this.elementForm.reset();
              this.getCompromisesPreviews();

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
                title: 'Se ha creado el texto libre exitosamente.'
              });
              this.elementForm.reset();

              let payloadSave = {
                room: this.meetingSelectedId,
                user: this.user
              }
              this.getMeetingMinute(this.meetingSelectedId);
              this.getCompromises('noSoft');
              this.socket.emit('event_element', payloadSave);

            },
            (err: any) => {

            }
          );


      } else if (this.selectType === 'elementodialogico') {

        if(type==='compromiso'){
          console.log("NUEVO TOPIC: ", newTopic);
          this.authService
            .addCompromise(
              description,
              newTopic,
              this.meetingSelectedId,
              type,
              this.projectSelectedId,
              this.MeetingMinuteSelected.number,
              participants,
              dateLimit
            )
            .subscribe(
              (resp) => {
  
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
                  title: 'Se ha creado el elemento exitosamente.'
                });
                this.elementForm.reset();
  
                let payloadSave = {
                  room: this.meetingSelectedId,
                  user: this.user
                }
                this.getMeetingMinute(this.meetingSelectedId);
  
                this.listaCantForTopic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  
                this.getCompromises('noSoft');
  
                this.socket.emit('event_element', payloadSave);
  
              },
              (err: any) => {
                /*   console.log(err); */
                /* Swal.fire('Error', err.message, 'error'); */
              }
            );

        }else{
          console.log("NUEVO TOPIC: ", newTopic);

          dateLimit = new Date().toLocaleDateString() + ' '+ new Date().toLocaleTimeString();
          this.authService
            .addCompromise(
              description,
              newTopic,
              this.meetingSelectedId,
              type,
              this.projectSelectedId,
              this.MeetingMinuteSelected.number,
              participants,
              dateLimit
            )
            .subscribe(
              (resp) => {
  
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
                  title: 'Se ha creado el elemento exitosamente.'
                });
                this.elementForm.reset();
  
                let payloadSave = {
                  room: this.meetingSelectedId,
                  user: this.user
                }
                this.getMeetingMinute(this.meetingSelectedId);
  
                this.listaCantForTopic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  
                this.getCompromises('noSoft');
  
                this.socket.emit('event_element', payloadSave);
  
              },
              (err: any) => {
                /*   console.log(err); */
                /* Swal.fire('Error', err.message, 'error'); */
              }
            );

        }


      }

    } else if (topic != '' && topic != null) {

      if (this.selectType === 'textolibre') {
        console.log("TEXTO LIBRO CREANDO");
        console.log("NUEVO TOPIC: ", topic);
        this.authService
          .addCompromise(
            description,
            topic,
            this.meetingSelectedId,
            'texto libre',
            this.projectSelectedId,
            this.MeetingMinuteSelected.number,
            this.user.email,
            'Sin fecha limite'
          )
          .subscribe(
            (resp) => {

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
                title: 'Se ha creado el texto libre exitosamente.'
              });
              this.elementForm.reset();

              let payloadSave = {
                room: this.meetingSelectedId,
                user: this.user
              }
              this.getMeetingMinute(this.meetingSelectedId);
              this.getCompromises('noSoft');
              this.socket.emit('event_element', payloadSave);

            },
            (err: any) => {

            }
          );


      } else if (this.selectType === 'elementodialogico') {


        if(type=== 'compromiso'){
          console.log("NUEVO TOPIC: ", topic);
          this.authService
            .addCompromise(
              description,
              topic,
              this.meetingSelectedId,
              type,
              this.projectSelectedId,
              this.MeetingMinuteSelected.number,
              participants,
              dateLimit
            )
            .subscribe(
              (resp) => {
  
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
                  title: 'Se ha creado el elemento dialógico exitosamente.'
                });
                this.elementForm.reset();
  
                let payloadSave = {
                  room: this.meetingSelectedId,
                  user: this.user
                }
                this.getMeetingMinute(this.meetingSelectedId);
                this.getCompromises('noSoft');
                this.socket.emit('event_element', payloadSave);
  
              },
              (err: any) => {
  
              }
            );

        }else{
          dateLimit = new Date().toLocaleDateString() + ' '+ new Date().toLocaleTimeString();
          console.log("NUEVO TOPIC: ", topic);
          this.authService
            .addCompromise(
              description,
              topic,
              this.meetingSelectedId,
              type,
              this.projectSelectedId,
              this.MeetingMinuteSelected.number,
              participants,
              dateLimit
            )
            .subscribe(
              (resp) => {
  
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
                  title: 'Se ha creado el elemento dialógico exitosamente.'
                });
                this.elementForm.reset();
  
                let payloadSave = {
                  room: this.meetingSelectedId,
                  user: this.user
                }
                this.getMeetingMinute(this.meetingSelectedId);
                this.getCompromises('noSoft');
                this.socket.emit('event_element', payloadSave);
  
              },
              (err: any) => {
  
              }
            );

        }

      
      }

    }


  }


  actualizarElemento() {

    let { description, type, participants, topic, number, dateLimit } =
      this.elementEditForm.value;


    /*     let newTopic; */
    /*     console.log( "ELEMENTO DESCIRIPCION: ", description);
        console.log( "ELEMENTO type: ", type);
        console.log( "ELEMENTO participants: ", participants);
        console.log( "ELEMENTO topic: ", topic);
        console.log( "ELEMENTO dateLimit: ", dateLimit); */

    if (topic === '') {

      topic = this.selectTopic;
    }

    console.log("NUEVO TOPIC: ", topic);


    this.authService
      .updateElement(
        description,
        topic,
        this.meetingSelectedId,
        type,
        this.projectSelectedId,
        this.MeetingMinuteSelected.number,
        participants,
        dateLimit,
        this.selectElementId,
        this.selectElementPosition,
        'noSort'
      )
      .subscribe(
        (resp) => {
          /*   console.log(resp); */
          /*  this.listProjectsInicial(); */
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
            title: 'Se ha actualizado el elemento exitosamente.'
          })
          /*   this.elements.push({
              topic: topic,
              description: description,
              type: type,
              participants: participants,
              id: ' ',
              _id: resp._id,
              dateLimit: dateLimit,
              number: this.MeetingMinuteSelected.number
            }); */

          let payloadSave = {
            room: this.meetingSelectedId,
            user: this.user
          }

          this.getMeetingMinute(this.meetingSelectedId);
          this.getCompromises('noSoft');
          this.socket.emit('event_element', payloadSave);

          /*  console.log('RESPUESTAAAAAAA DE CREACION DE COMPROMISO', resp);
          console.log('ID DE COMPROMISO: ', resp._id); */
        },
        (err: any) => {
          /*   console.log(err); */
          /* Swal.fire('Error', err.message, 'error'); */
        }
      );

    /*  console.log( "ELEMENTO number: ", number); */
  }


  getCompromises(isSoft2: string) {
    /*  this.resetNumberExperimenta(0); */
    this.authService.getCompromises(this.meetingSelectedId).subscribe(
      (resp: any[]) => {
        console.log(resp);
        /*  this.listProjectsInicial(); */

        let pro = 0;
        let relativ = 0;
        let numTopics = 0;
        // CREAMOS UN ARREGLO CON LA CANTIDAD POR TEMA
        /*     this.elements = resp; */
        this.listNumbers1 = [];

        if (resp[0].isSort === 'yesSort' && isSoft2 != 'noSoft') {

          console.log("CANTIDAD DE ELEMENTOS RESP: ", resp.length)

          for (let z = 0; z < resp.length + 1; z++) {
            for (let y = 0; y < resp.length; y++) {
              if (resp[y].position === '' + z) {
                this.elements.push(resp[y]);
              }
            }
          }

          // RECORREMOS TODOS LOS ELEMENTOS DE AQUI

          // POR CADA ELEMENTO VAMOS GUARDANDO SU POSICION
          /*  this.actualizarElemento2(this.elements[agh]); */

          // ACTUALIZAR LOS ELEMENTOS 

        } else if (resp[0].isSort === 'noSort' || isSoft2 === 'noSoft') {
          this.elements = resp;
          for (let z = 0; z < resp.length; z++) {
            for (let topic = 0; topic < this.MeetingMinuteSelected.topics.length; topic++) {
              if (resp[z].topic === topic && resp[z].type != 'texto libre') {
                this.elements[z].position = this.listaCantForTopic[topic];

                /*   if(resp[z].topic===1){
                    this.elements[z].position = this.elements[z].position + this.listaCantForTopic[0];
    
                  }
                  if(resp[z].topic===2){
                    this.elements[z].position = this.elements[z].position + this.listaCantForTopic[0] + this.listaCantForTopic[1];
    
                  }
                  if(resp[z].topic===3){
                    this.elements[z].position = this.elements[z].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2] ;
                    
                  }
                  if(resp[z].topic===4){
                    this.elements[z].position = this.elements[z].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2] + this.listaCantForTopic[3];
                    
                  }  */

                this.listaCantForTopic[topic] = this.listaCantForTopic[topic] + 1;
                this.cantElementsThis = this.cantElementsThis + 1;
              }
            }

          }
          // RECORREMOS NUEVAMENTE Y ASIGNAMOS POSICION
          for (let oo = 0; oo < resp.length; oo++) {
            for (let topico = 0; topico < this.listaCantForTopic.length; topico++) {

              if (resp[oo].topic === topico && resp[oo].type != 'texto libre') {

                /*    this.elements[oo].position = this.listaCantForTopic[topico]; */
                if (resp[oo].topic === 0) {
                  this.elements[oo].position = 1 + this.elements[oo].position;
                  this.listNumbers1.push(' ' + this.elements[oo].description[0] + this.elements[oo].description[1] + this.elements[oo].description[2] + this.elements[oo].description[3] + this.elements[oo].description[4] + ', ' + this.elements[oo].participants + this.elements[oo].dateLimit + '[' + this.elements[oo].number + '.' + this.elements[oo].position + '] ' + 'topic: ' + resp[oo].topic);

                }

                if (resp[oo].topic === 1) {
                  this.elements[oo].position = 1 + this.elements[oo].position + this.listaCantForTopic[0];
                  this.listNumbers1.push(' ' + this.elements[oo].description[0] + this.elements[oo].description[1] + this.elements[oo].description[2] + this.elements[oo].description[3] + this.elements[oo].description[4] + ', ' + this.elements[oo].participants + this.elements[oo].dateLimit + '[' + this.elements[oo].number + '.' + this.elements[oo].position + '] ' + 'topic: ' + resp[oo].topic);
                  /*      this.actualizarElemento2(this.elements[oo]); */
                }
                if (resp[oo].topic === 2) {
                  this.elements[oo].position = 1 + this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1];
                  this.listNumbers1.push(' ' + this.elements[oo].description[0] + this.elements[oo].description[1] + this.elements[oo].description[2] + this.elements[oo].description[3] + this.elements[oo].description[4] + ', ' + this.elements[oo].participants + this.elements[oo].dateLimit + '[' + this.elements[oo].number + '.' + this.elements[oo].position + '] ' + 'topic: ' + resp[oo].topic);
                  /*   this.actualizarElemento2(this.elements[oo]); */
                }
                if (resp[oo].topic === 3) {
                  this.elements[oo].position = 1 + this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2];

                  this.listNumbers1.push(' ' + this.elements[oo].description[0] + this.elements[oo].description[1] + this.elements[oo].description[2] + this.elements[oo].description[3] + this.elements[oo].description[4] + ', ' + this.elements[oo].participants + this.elements[oo].dateLimit + '[' + this.elements[oo].number + '.' + this.elements[oo].position + '] ' + 'topic: ' + resp[oo].topic);
                  /*    this.actualizarElemento2(this.elements[oo]); */
                }
                if (resp[oo].topic === 4) {
                  this.elements[oo].position = 1 + this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2] + this.listaCantForTopic[3];
                  this.listNumbers1.push(' ' + this.elements[oo].description[0] + this.elements[oo].description[1] + this.elements[oo].description[2] + this.elements[oo].description[3] + this.elements[oo].description[4] + ', ' + this.elements[oo].participants + this.elements[oo].dateLimit + '[' + this.elements[oo].number + '.' + this.elements[oo].position + '] ' + 'topic: ' + resp[oo].topic);
                  /*    this.actualizarElemento2(this.elements[oo]); */
                }
                if (resp[oo].topic === 5) {
                  this.elements[oo].position = 1 + this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2] + this.listaCantForTopic[3] + this.listaCantForTopic[4];
                  this.listNumbers1.push(' ' + this.elements[oo].description[0] + this.elements[oo].description[1] + this.elements[oo].description[2] + this.elements[oo].description[3] + this.elements[oo].description[4] + ', ' + this.elements[oo].participants + this.elements[oo].dateLimit + '[' + this.elements[oo].number + '.' + this.elements[oo].position + '] ' + 'topic: ' + resp[oo].topic);
                  /*  this.actualizarElemento2(this.elements[oo]); */
                }

              }

            }



            // RECORREMOS TODOS LOS ELEMENTOS DE AQUI
            for (let agh = 0; agh < this.elements.length; agh++) {
              console.log(" ELEMENT " + agh, this.elements[agh])
              // POR CADA ELEMENTO VAMOS GUARDANDO SU POSICION
              /*  this.actualizarElemento2(this.elements[agh]); */

              // ACTUALIZAR LOS ELEMENTOS 
              console.log("ACTUALIZANDO LA POSICION DEL ELEMENTO", this.elements[agh]);
              this.authService
                .updateElement(
                  this.elements[agh].description,
                  this.elements[agh].topic,
                  this.meetingSelectedId,
                  this.elements[agh].type,
                  this.projectSelectedId,
                  this.MeetingMinuteSelected.number,
                  this.elements[agh].participants,
                  this.elements[agh].dateLimit,
                  this.elements[agh]._id,
                  agh,
                  'noSort'
                )
                .subscribe(
                  (resp) => {

                    /* this.elements[agh].position = agh -   this.elements[agh].number + 1 */


                    /*                  let payloadSave = {
                                       room: this.meetingSelectedId,
                                       user: this.user
                                     }
                                     this.socket.emit('event_element', payloadSave); */
                    /*  console.log('RESPUESTAAAAAAA DE CREACION DE COMPROMISO', resp);
                    console.log('ID DE COMPROMISO: ', resp._id); */
                  },
                  (err: any) => {
                    /*   console.log(err); */
                    /* Swal.fire('Error', err.message, 'error'); */
                  }
                );

              /*  console.log( "ELEMENTO number: ", number); */


            }


          }

        }




        console.log("LISTA CON CANTIDAD DE ELEMENTOS POR TEMA: ", this.listaCantForTopic);

        console.log("ELEMENTOS: ", this.elements);
        /*         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'se han cargado los elementos ',
          showConfirmButton: false,
          timer: 2000,
        }); */
      },
      (err: any) => {
        /*     console.log(err); */
        /*  Swal.fire('Error', err.message, 'error'); */
      }
    );
  }

  getCompromisesPreviews() {
    this.resetNumberExperimenta(0);
    this.authService.getCompromisesPreview(this.projectSelectedId).subscribe(
      (resp: any[]) => {
        this.elementsPreviews = resp;
        console.log("ELEMENTOS PREVIOS: ", resp);

      },
      (err: any) => {
        /*    console.log(err); */
        /*  Swal.fire('Error', err.message, 'error'); */
      }
    );
  }

  async AddResponsible(numberOrder: number) {
    console.log('ID: ', numberOrder);

    /*  this.elements.push({uno: id, dos: "adios"}); */

    await Swal.fire({
      title: 'Agregar un encargado',
      input: 'select',
      inputOptions: {
        'Asistentes': this.MeetingMinuteSelected.participants,
      },
      inputPlaceholder: 'Seleccionar un encargado',
      showCancelButton: true,
      confirmButtonText: 'Asignar como encargado',
      showDenyButton: true,
      denyButtonColor: 'rgb(105, 152, 92)',
      denyButtonText: `Ingresar usuario manualmente`,
      preConfirm: (user) => {
        this.crearResponsbile(this.MeetingMinuteSelected.participants[user], numberOrder);
        /*         this.createMember(emailMember, this.projectSelected._id); */
      },
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Añadir encargado',
          text: '¿Email del usuario?',
          input: 'email',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Asignar encargado',

          showLoaderOnConfirm: true,
          preConfirm: (user) => {
            this.crearResponsbile(user, numberOrder);
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
          } else if (result.isDenied) {
            console.log('RESULTADO ROJO', result);
          }
        });
      }
    });

  }

  crearResponsbile(user: string, numberOrder: number) {
    this.authService.getUserByEmail(user).subscribe(
      (resp) => {
        console.log(
          'EDIT_PROYECT respuesta de si es que hay un email con eso',
          resp
        );
        /*         this.listProjectsInicial(); */
        if (resp === null) {
          Swal.fire({
            title:
              'El correo electrónico ingresado no pertenece a ningún usuario de la plataforma.',
            icon: 'error',
          });

        } else {
          this.authService
            .addResponsible(user, this.elements[numberOrder]._id)
            .subscribe(
              (resp: any[]) => {
                /*   console.log(resp); */
                /*  this.listProjectsInicial(); */
                this.elements[numberOrder].participants = [user];
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
                  title: 'Se ha añadido el encargado ' + user + ' exitosamente.'
                })
                let payload = {
                  room: this.meetingSelectedId,
                  user: this.user,
                };
                this.socket.emit('event_element', payload);
              },
              (err: any) => {
                /*           console.log(err); */
                /* Swal.fire('Error', err.message, 'error'); */
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

  addTime(numberOrder: number) {
    /*     console.log('ID: ', numberOrder); */

    /*  this.elements.push({uno: id, dos: "adios"}); */
    Swal.fire({
      title: 'Agregar una fecha limite',
      text: '¿Cuál es la fecha límite?',
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
        this.crearTiempo(dateLimit, numberOrder);
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


  crearTiempo(dateLimit: string, numberOrder: number) {
    this.authService
      .addDateLimit(dateLimit, this.elements[numberOrder]._id)
      .subscribe(
        (resp) => {
          /*           console.log(resp); */
          /*  this.listProjectsInicial(); */
          this.elements[numberOrder].dateLimit = resp.dateLimit;
          let payload = {
            room: this.meetingSelectedId,
            user: this.user,
          };
          this.socket.emit('event_element', payload);
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
            title: 'Se ha añadido la fecha exitosamente.'
          })
        },
        (err: any) => {
          /*          console.log(err); */
          /*  Swal.fire('Error', err.message, 'error'); */
        }
      );
  }

  async addFile() {
    const { value: file } = await Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        accept: 'image/*',
        'aria-label': 'Upload your profile picture',
      },
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: 'Your uploaded picture',
          imageUrl: 'e.target.result',
          imageAlt: 'The uploaded picture',
        });
      };
      reader.readAsDataURL(file);
    }
  }

  async addURL() {
    const { value: url } = await Swal.fire({
      input: 'text',
      title: 'Ingresar un enlace de pagina web valido',
      inputPlaceholder: 'Escribir URL completa',
    });


    if (url) {
      this.links.push(url);
      setTimeout(() => {
        this.saveMeetingMinute();
      }, 1000);
    }

  }

  notificarParticipantes(fase: string) {
    this.authService
      .notifyParticipants(this.MeetingMinuteSelected, this.meetingSelectedId, fase, 'http://70.35.204.110:4200/#' + this.userSelected.lastLink)
      .subscribe(
        (resp) => {
          /*    console.log(resp); */
          /*  this.listProjectsInicial(); */
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
            title: 'Se ha modificado el invitado exitosamente.'
          })
        },
        (err: any) => {
          console.log(err);
          Swal.fire('Error', err.message, 'error');
        }
      );
  }



  addInMeeting() {
    /*     console.log('addpremeeting'); */
    /*   this.MeetingMinuteSelected.realStartTime = new Date().getFullYear + '-' + new Date().getMonth() + '-' + new Date().getDay + ' ' + new Date().toLocaleTimeString(); */
    console.log("REAL TIME COMIENZO: ", this.MeetingMinuteSelected.realStartTime);
    this.authService.addInMeeting(this.meetingSelectedId).subscribe(
      (resp: any) => {
        const url2 =
          '/main/' +
          this.projectSelectedId +
          '/meeting/' +
          this.meetingSelectedId +
          '/in-meeting';
        this.authService
          .setStateMeeting('in-meeting', this.meetingSelectedId)
          .subscribe(
            (resp: any) => {
              const url2 =
                '/main/' +
                this.projectSelectedId +
                '/meeting/' +
                this.meetingSelectedId +
                '/in-meeting';

              this.router.navigateByUrl(url2);
              location.reload();
              let payloadSave = {
                room: this.meetingSelectedId,
                user: this.user
              }
              this.socket.emit('event_reload', payloadSave);
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

  addPostMeeting() {
    /*  this.MeetingMinuteSelected.realEndTime =  this.MeetingMinuteSelected.realStartTime = new Date().getFullYear + '-' + new Date().getMonth() + '-' + new Date().getDay + ' ' + new Date().toLocaleTimeString(); */
    this.authService.addInMeeting(this.meetingSelectedId).subscribe(
      (resp: any) => {
        const url2 =
          '/main/' +
          this.projectSelectedId +
          '/meeting/' +
          this.meetingSelectedId +
          '/in-meeting';
        console.log(this.projectSelectedId);
        console.log('RESP 1:', resp);
        this.authService.setStateMeeting('post-meeting', this.meetingSelectedId).subscribe(
          (resp: any) => {
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/post-meeting';
            console.log(this.projectSelectedId);
            this.router.navigateByUrl(url2);
            let payloadSave = {
              room: this.meetingSelectedId,
              user: this.user
            }
            location.reload();
            this.socket.emit('event_reload', payloadSave);

            console.log('RESP 1:', resp);
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

  realDurationMeetingMinute() {
    this.realDuration = { time: new Date() }
  }



  addPreMeeting() {
    this.authService.addPreMeeting(this.meetingSelectedId).subscribe(
      (resp: any) => {
        const url2 =
          '/main/' +
          this.projectSelectedId +
          '/meeting/' +
          this.meetingSelectedId +
          '/pre-meeting';
        this.authService.setStateMeeting('pre-meeting', this.meetingSelectedId).subscribe(
          (resp: any) => {
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/pre-meeting';
            this.router.navigateByUrl(url2);
            let payloadSave = {
              room: this.meetingSelectedId,
              user: this.user
            }
            location.reload();
            this.socket.emit('event_reload', payloadSave);

          },
          (err: string | undefined) => {
          }
        );
      },
      (err: string | undefined) => {

      }
    );

  }


  async nextFasePre() {
    /*     this.MeetingMinuteSelected.realStartTime =  new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDay() + ' ' + new Date().toLocaleTimeString(); */
    const { value: accept } = await Swal.fire({
      title: 'Concluyendo creación de reunión',
      input: 'checkbox',
      inputValue: 1,
      inputPlaceholder:
        '¿Enviar notificación a secretario y Anfitrion?',
      confirmButtonText:
        'Continuar a preparar la reunión <i class="fa fa-arrow-right"></i>',

    })

    console.log("real start time", this.MeetingMinuteSelected.realStartTime);
    if (accept) {
      this.notificarParticipantes('pre-reunión');
      /*   this.saveMeetingMinute(); */
      this.saveMeetingMinute();
      setTimeout(() => {
        this.addPreMeeting();

      }, 2000);
    }
    else {
      this.saveMeetingMinute();
      /*    */
      setTimeout(() => {

        this.addPreMeeting();

      }, 1000);

    }

  }

  async nextFaseIn() {
    if (!this.isDateError) {
      let fecha = new Date().toLocaleDateString();

      if (fecha.split("-").length > 1) {
        Swal.fire({title: 'EDGE'});
        this.MeetingMinuteSelected.realStartTime = fecha.split('-')[1] + '-' + fecha.split('-')[0] + '-' + fecha.split('-')[2] + ' ' + new Date().toLocaleTimeString();
      }
      else {
        let startTime = fecha.split('/')[1] + '-' + fecha.split('/')[0] + '-' + fecha.split('/')[2];
        this.MeetingMinuteSelected.realStartTime = startTime.split('-')[0] + '-' + startTime.split('-')[1] + '-' + startTime.split('-')[2] + ' ' + new Date().toLocaleTimeString();
      }


      console.log("TIEMPO START ANTES", this.MeetingMinuteSelected.realStartTime);


      /*  Swal.fire({ html: `You selected:` }) */
      const { value: accept } = await Swal.fire({
        title: 'Concluyendo la preparación de la reunión',
        input: 'checkbox',
        inputValue: 1,
        inputPlaceholder:
          '¿Enviar notificación a invitados?',
        confirmButtonText:
          'Iniciar la sesión de reunión <i class="fa fa-arrow-right"></i>',
      })

      if (accept) {
        this.notificarParticipantes('en-reunión');
        this.saveMeetingMinute();
        setTimeout(() => {
          this.addInMeeting();
        }, 2000);
      }
      else {
        this.saveMeetingMinute();
        setTimeout(() => {
          this.addInMeeting();
        }, 2000);

      }

    } else if (this.isDateError) {

      Swal.fire({
        icon: 'warning',
        title: 'Verificar el horario de la reunión.',
        confirmButtonText: 'Entendido!',

      })
    }
  }

  async nextFasePost() {
    /*  this.createTasks(); */
    let fecha = new Date().toLocaleDateString();

    if (fecha.split("-").length > 1) {
      Swal.fire({title: 'EDGE'});
      this.MeetingMinuteSelected.realEndTime = fecha.split('-')[1] + '-' + fecha.split('-')[0] + '-' + fecha.split('-')[2] + ' ' + new Date().toLocaleTimeString();
    }
    else {
      let startTime = fecha.split('/')[1] + '-' + fecha.split('/')[0] + '-' + fecha.split('/')[2];
      this.MeetingMinuteSelected.realEndTime = startTime.split('-')[0] + '-' + startTime.split('-')[1] + '-' + startTime.split('-')[2] + ' ' + new Date().toLocaleTimeString();
    }

    const { value: accept } = await Swal.fire({
      title: 'Concluyendo la sesión de reunión',
      input: 'checkbox',
      inputValue: 1,
      inputPlaceholder:
        '¿Enviar notificación a asistentes?',
      confirmButtonText:
        'Revisar detalles finales <i class="fa fa-arrow-right"></i>',

    })


    if (accept) {

      this.notificarParticipantes('post-reunión');
      this.saveMeetingMinute();

      setTimeout(() => {
        this.addPostMeeting();
      }, 2000);
    }
    else {
      this.saveMeetingMinute();
      setTimeout(() => {
        this.addPostMeeting();
      }, 2000);

    }

  }
  async createTasks() {
    console.log('[TASK] ACTIVADO LA CREACION');
    this.authService.createTasks(this.meetingSelectedId).subscribe(
      (resp: any) => {
        console.log('[TASK] CREATE TASKS FOR CCOMPROMISES repuesta:', resp);

      },
      (err: string | undefined) => {
        Swal.fire('Error', err, 'error');
      }
    );


  }


  async nextFasePostCreate() {

    const { value: accept } = await Swal.fire({
      title: 'Archivando la reunión',
      input: 'checkbox',
      inputValue: 1,
      inputPlaceholder:
        '¿Enviar notificación a invitados?',
      confirmButtonText:
        'Archivar la reunión <i class="fa fa-arrow-right"></i>',

    })

    if (accept) {
      this.notificarParticipantes('finish-reunión');
      this.saveMeetingMinute();
      setTimeout(() => {

        this.finish();

      }, 2000);
    }
    else {
      this.saveMeetingMinute();
      setTimeout(() => {

        this.finish();

      }, 2000);

    }

  }

  finish() {
    this.authService.setStateMeeting('finish', this.meetingSelectedId).subscribe(
      (resp: any) => {
        const url2 =
          '/main/' +
          this.projectSelectedId +
          '/meeting/' +
          this.meetingSelectedId +
          '/post-meeting';
        console.log(this.projectSelectedId);
        this.router.navigateByUrl(url2);
        let payloadSave = {
          room: this.meetingSelectedId,
          user: this.user
        }
        location.reload();
        this.socket.emit('event_reload', payloadSave);
      },
      (err: string | undefined) => {
        Swal.fire('Error', err, 'error');
      }
    );
  }


  editable() {
    this.isEditable = !this.isEditable;
  }
  editableObjetivo() {
    this.isEditable = !this.isEditable;
    this.isEditableObjetivo = !this.isEditableObjetivo;

  }

  editableLugar() {
    this.isEditable = !this.isEditable;
    this.isEditableLugar = !this.isEditableLugar;

  }

  editableFecha() {
    this.isEditable = !this.isEditable;
    this.isEditableFecha = !this.isEditableFecha;

  }

  editableInicio() {

    this.isEditable = !this.isEditable;
    this.isEditableInicio = !this.isEditableInicio;
  }

  editableTermino() {
    this.isEditable = !this.isEditable;
    this.isEditableTermino = !this.isEditableTermino;
    this.isDateError = false;
  }



  colapseArray(i: any) {
    this.numerExperimental = 0;

    this.colapseArrayBol[i] = !this.colapseArrayBol[i];


  }

  isColapse(i: any) {
    if (this.colapseArrayBol[i]) {
      return true;
    } else {
      return false
    }

  }

  openBackDropCustomClass(content: any) {
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
  }

  openWindowCustomClass(content: any) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  openSm(content: any) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  openFullscreen(content: any) {
    this.modalService.open(content, { fullscreen: true });
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  openScrollableContent(longContent: any, numTopic: number, type: any) {
    if (type === 'textolibre') {
      this.selectType = 'textolibre';

    } else if (type === 'elementodialogico') {
      this.selectType = 'elementodialogico';

    }
    this.selectTopic = numTopic;

    let nowTime2 = new Date().toLocaleDateString();
    
    if(nowTime2.split("-").length > 1){

      let nowTime3 = nowTime2.split('-')[1] + '-' + nowTime2.split('-')[0] + '-' + nowTime2.split('-')[2] + ' ' + new Date().toLocaleTimeString();
      let nowTime4 = nowTime2.split('-')[1] + '/' + nowTime2.split('-')[0] + '/' + nowTime2.split('-')[2] + ' ' + new Date().toLocaleTimeString();

      
      let meetTime2 = this.MeetingMinuteSelected.fechaI;
      let meetTime3 = meetTime2.split('-')[1] + '-' + meetTime2.split('-')[0] + '-' + meetTime2.split('-')[2] + ' ' + this.MeetingMinuteSelected.startHour
      let meetTime4 = meetTime2.split('-')[1] + '/' + meetTime2.split('-')[0] + '/' + meetTime2.split('-')[2] + ' ' + this.MeetingMinuteSelected.startHour
  

      let nowTime = new Date(nowTime3).getTime();
      let nowTimeFirefox = new Date(nowTime4).getTime();

      let meetTime = new Date(meetTime3).getTime();
      let meetTimeFirefox = new Date(meetTime4).getTime();

      console.log("NowTime con split = ", nowTime3);
      console.log("NowTime con split = ", nowTime);
      console.log("NowTime 2 = ", nowTime2);
      console.log("meetTime 3 = ", meetTime);
      console.log("meetTime 4 = ", meetTime2);

      console.log("NowTime con meetTimeFirefox = ", meetTimeFirefox);
      console.log("NowTime con nowTimeFirefox = ", nowTimeFirefox);

      console.log("FECHA DE HOY: ", new Date().toLocaleDateString())
  
      if (nowTime > meetTime || nowTimeFirefox > meetTimeFirefox) {
  
        this.isTimeMeet = 'ZZZZZZZZZZZZ';
        this.modalService.open(longContent, { scrollable: true, modalDialogClass: 'dark-modal' });
  
      } else {
  
        this.isTimeMeet = 'BBBBBBBBBB';
        Swal.fire({
          icon: 'warning',
          title: 'Horario de reunión no valido para realizar esta acción.',
          confirmButtonText: 'Entendido!',
  
        })
      }



    }else{
      let nowTime3Aux = nowTime2.split('/')[1] + '-' + nowTime2.split('/')[0] + '-' + nowTime2.split('/')[2];
      let nowTime3 = nowTime3Aux.split('-')[0] + '-' + nowTime3Aux.split('-')[1] + '-' + nowTime3Aux.split('-')[2] + ' ' + new Date().toLocaleTimeString();
      let meetTime2 = this.MeetingMinuteSelected.fechaI;
      let meetTime3 = meetTime2.split('-')[1] + '-' + meetTime2.split('-')[0] + '-' + meetTime2.split('-')[2] + ' ' + this.MeetingMinuteSelected.startHour
  
      let nowTime = new Date(nowTime3).getTime();
      let meetTime = new Date(meetTime3).getTime();
      console.log("NowTime con split = ", nowTime3);
      console.log("NowTime con split = ", nowTime);
      console.log("NowTime 2 = ", nowTime2);
      console.log("meetTime 3 = ", meetTime);
      console.log("meetTime 4 = ", meetTime2);
  
      console.log("FECHA DE HOY: ", new Date().toLocaleDateString())
  
      if (nowTime > meetTime) {
  
        this.isTimeMeet = 'ZZZZZZZZZZZZ';
        this.modalService.open(longContent, { scrollable: true, modalDialogClass: 'dark-modal' });
  
      } else {
  
        this.isTimeMeet = 'BBBBBBBBBB';
        Swal.fire({
          icon: 'warning',
          title: 'Horario de reunión no valido para realizar esta acción.',
          confirmButtonText: 'Entendido!',
  
        })
      }
      
    }



  }
  elementSelected: any

  openScrollableContent2(longContent2: any, numTopic: number, element: any) {
    /*     this.resetNumberExperimenta(this.numerExperimental); */
    /*     this.numerExperimental = 0; */
    console.log("ELEMNTO PARA ACTUALIZAR: ", element)
    this.selectTopic = numTopic;
    this.selectResponsable = element.participants;
    this.selectType = element.type;
    this.selectElementId = element._id;
    this.selectElementPosition = element.position;
    this.elementEditForm.patchValue(element);
    this.elementSelected = element;
    this.modalService.open(longContent2, { scrollable: true, modalDialogClass: 'dark-modal' });
  }

  openModalDialogCustomClass(content: any) {

    this.modalService.open(content, { modalDialogClass: 'dark-modal' });
  }

  saveElement() {

  }

  numberExperimenta(numerExperimental: number) {
    return this.numerExperimental = numerExperimental + 1;

  }

  resetNumberExperimenta(numerExperimental: number) {
    return this.numerExperimental = 0;

  }

  determinaNumer(i: number, u: number): any {

    console.log("ENTRANDO AL FOR");

    let cantidadDeElementosTopic = this.listaCantForTopic[i];

    let cantidadTotalDeElementos = this.elements.length;

    if (u < cantidadDeElementosTopic) {
      return cantidadDeElementosTopic;
    } else {
      return cantidadTotalDeElementos;
    }
    console.log("EN EL TEMA" + i + "HAY: " + cantidadDeElementosTopic + "de elementos");


  }


  addMeeting() {

    this.authService
      .addMeeting(this.projectSelectedId, this.MeetingMinuteSelected.number)
      .subscribe(
        (resp: any) => {

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


        },
        (err: string | undefined) => {
          Swal.fire('Error', err, 'error');
        }
      );
  }


  colapseAll() {
    let x = 0
    while (x < this.colapseArrayBol.length) {
      this.colapseArrayBol[x] = !this.colapseArrayBol[x];
      x++;
    }
    this.desplega = !this.desplega;
  }

  muestraKanban() {
    this.authService
      .muestraKanban()
      .subscribe((resp) => {

        console.log("KANBAN", resp);
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
          title: 'Visualización Microservice-kanban estado:',
          text: 'en desarrollo'
        })
      },
        (err: any) => {
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
            title: 'Visualización Microservice-kanban estado:',
            text: 'en desarrollo'
          })
          /*   console.log(err); */
          /* Swal.fire('Error', err.message, 'error'); */
        }
      );

  }

  muestraTarea() {
    this.authService
      .muestraTare()
      .subscribe((resp) => {

        console.log("TAREA", resp);
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
          title: 'Redirigiendo a tareas:',
        })
        this.router.navigateByUrl('/main/task');


      },
        (err: any) => {
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
            title: 'Visualización Microservice-taks estado:',
            text: 'en desarrollo'
          })
          /*   console.log(err); */
          /* Swal.fire('Error', err.message, 'error'); */
        }
      );

  }

  isAsistentesColapseFuncion() {
    this.isAsistentesColapse = !this.isAsistentesColapse;
  }

  isCompromisosPreviosColapseFuncion() {
    this.isCompromisosPreviosColapse = !this.isCompromisosPreviosColapse;
  }

  isTablaDeTemasColapseFuncion() {
    this.isTemarioColapse = !this.isTemarioColapse;
  }

  isDesarrolloColapseFuncion() {

    this.isDesarrolloColapse = !this.isDesarrolloColapse;
    this.colapseAll();
  }

  isAdjuntosColapseFuncion() {
    this.isAdjuntoColapse = !this.isAdjuntoColapse;
  }


  descargarPDF() {
    let ausentes = '';
    for(let ausentesCount=0;  ausentesCount < this.MeetingMinuteSelected.absents.length; ausentesCount++){
      ausentes = ausentes + this.MeetingMinuteSelected.absents[ausentesCount] + ' ';
    }
    const doc = new jsPDF();
    let desarrollo = '';
    let links = '';
    let descriptionAux = '';
    let compromisesPrevies = '';

    if (this.MeetingMinuteSelected.number != 0) {

      for (let ep = 0; ep < this.elementsPreviews.length; ep++) {
        if (this.elementsPreviews[ep].type === 'compromiso' && this.elementsPreviews[ep].number != this.MeetingMinuteSelected.number) {

          if (this.elementsPreviews[ep].description.split(' ').length > 18) {

            compromisesPrevies = compromisesPrevies + '\n    ' + this.elementsPreviews[ep].number + '.' + this.elementsPreviews[ep].position + ': ';
            for (let s = 0; s < this.elementsPreviews[ep].description.split(' ').length; s++) {
              compromisesPrevies = compromisesPrevies + ' ' + this.elementsPreviews[ep].description.split(' ')[s] + ' ';
              if (s === 18 || s === 36 || s === 54 || s === 72 || s === 90 || s === 108) {
                compromisesPrevies = compromisesPrevies + ' \n   ';
              }
            }
            compromisesPrevies = compromisesPrevies + ', ' + this.elementsPreviews[ep].participants + ', ' + this.elementsPreviews[ep].dateLimit + ". ";
            if (this.elementsPreviews[ep].state === 'new') {
              compromisesPrevies = compromisesPrevies + ' No atendido.';
            }
            if (this.elementsPreviews[ep].state === 'desarrollo') {
              compromisesPrevies = compromisesPrevies + ' En desarrollo.';
            }
            if (this.elementsPreviews[ep].state === 'pausada') {
              compromisesPrevies = compromisesPrevies + ' En pausa.';
            }
            if (this.elementsPreviews[ep].state === 'evaluando') {
              compromisesPrevies = compromisesPrevies + ' En evaluación.';
            }
            if (this.elementsPreviews[ep].state === 'finalizado') {
              compromisesPrevies = compromisesPrevies + ' Finalizado.';
            }
            if (this.elementsPreviews[ep].state === 'borrada') {
              compromisesPrevies = compromisesPrevies + ' Eliminada.';
            }

          } else {
            compromisesPrevies = compromisesPrevies + '\n    ' + this.elementsPreviews[ep].number + '.' + this.elementsPreviews[ep].position + ': ' + this.elementsPreviews[ep].description + ', ' + this.elementsPreviews[ep].participants + ', ' + this.elementsPreviews[ep].dateLimit + ". ";
            if (this.elementsPreviews[ep].state === 'new') {
              compromisesPrevies = compromisesPrevies + ' No atendido.';
            }
            if (this.elementsPreviews[ep].state === 'new') {
              compromisesPrevies = compromisesPrevies + ' No atendido.';
            }
            if (this.elementsPreviews[ep].state === 'desarrollo') {
              compromisesPrevies = compromisesPrevies + ' En desarrollo.';
            }
            if (this.elementsPreviews[ep].state === 'pausada') {
              compromisesPrevies = compromisesPrevies + ' En pausa.';
            }
            if (this.elementsPreviews[ep].state === 'evaluando') {
              compromisesPrevies = compromisesPrevies + ' En evaluación.';
            }
            if (this.elementsPreviews[ep].state === 'finalizado') {
              compromisesPrevies = compromisesPrevies + ' Finalizado.';
            }
            if (this.elementsPreviews[ep].state === 'borrada') {
              compromisesPrevies = compromisesPrevies + ' Eliminada.';
            }
          }

        }

      }

    } else {
      compromisesPrevies = '\n       No existen compromisos previos.' + '\n\n'
    }


    for (let i = 0; i < this.MeetingMinuteSelected.topics.length; i++) {

      desarrollo = desarrollo + '\n\n     Tema ' + (i + 1) + ' ' + this.MeetingMinuteSelected.topics[i] + '\n\n';

      for (let z = 0; z < this.elements.length; z++) {

        if (this.elements[z].type === 'texto libre' && this.elements[z].topic === i) {
          if (this.elements[z].description.split(' ').length > 20) {
            desarrollo = desarrollo + '          ';
            for (let s = 0; s < this.elements[z].description.split(' ').length; s++) {
              desarrollo = desarrollo + ' ' + this.elements[z].description.split(' ')[s] + ' ';
              if (s === 20 || s === 40 || s === 60 || s === 80 || s === 100 || s === 120) {
                desarrollo = desarrollo + ' \n          ';
              }
            }
            desarrollo = desarrollo + '\n';
          }
          else {
            desarrollo = desarrollo + '          ' + '' + ' ' + this.elements[z].description + '\n';
          }
        }

        else if (this.elements[z].topic === i && this.elements[z].dateLimit != null && this.elements[z].dateLimit != '') {

          if (this.elements[z].type === 'compromiso') {
            if (this.elements[z].description.split(' ').length > 18) {
              desarrollo = desarrollo + '           ' + 'CO' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ';
              for (let s = 0; s < this.elements[z].description.split(' ').length; s++) {
                desarrollo = desarrollo + ' ' + this.elements[z].description.split(' ')[s] + ' ';
                if (s === 18 || s === 36 || s === 54 || s === 72 || s === 90 || s === 108) {
                  desarrollo = desarrollo + ' \n                         ';
                }
              }
              desarrollo = desarrollo + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';

            } else {
              desarrollo = desarrollo + '           ' + 'CO' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';
            }
          }
          if (this.elements[z].type === 'duda') {
            if (this.elements[z].description.split(' ').length > 18) {
              desarrollo = desarrollo + '           ' + 'DU' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ';
              for (let s = 0; s < this.elements[z].description.split(' ').length; s++) {
                desarrollo = desarrollo + ' ' + this.elements[z].description.split(' ')[s] + ' ';
                if (s === 18 || s === 36 || s === 54 || s === 72 || s === 90 || s === 108) {
                  desarrollo = desarrollo + ' \n                         ';
                }
              }
              desarrollo = desarrollo + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';

            } else {
              desarrollo = desarrollo + '           ' + 'DU' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';
            }
          }
          if (this.elements[z].type === 'acuerdo') {
            if (this.elements[z].description.split(' ').length > 18) {
              desarrollo = desarrollo + '           ' + 'AC' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ';
              for (let s = 0; s < this.elements[z].description.split(' ').length; s++) {
                desarrollo = desarrollo + ' ' + this.elements[z].description.split(' ')[s] + ' ';
                if (s === 18 || s === 36 || s === 54 || s === 72 || s === 90 || s === 108) {
                  desarrollo = desarrollo + ' \n                         ';
                }
              }
              desarrollo = desarrollo + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';
            } else {
              desarrollo = desarrollo + '           ' + 'AC' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';
            }
          }
          if (this.elements[z].type === 'desacuerdo') {
            if (this.elements[z].description.split(' ').length > 18) {
              desarrollo = desarrollo + '           ' + 'DE' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ';
              for (let s = 0; s < this.elements[z].description.split(' ').length; s++) {
                desarrollo = desarrollo + ' ' + this.elements[z].description.split(' ')[s] + ' ';
                if (s === 18 || s === 36 || s === 54 || s === 72 || s === 90 || s === 108) {
                  desarrollo = desarrollo + ' \n                         ';
                }
              }
              desarrollo = desarrollo + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';

            } else {
              desarrollo = desarrollo + '           ' + 'DE' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + this.elements[z].dateLimit + '\n';
            }
          }
          console.log("[CONTROLLER MEETINGMINUTE: PDF] elements " + z + " tiene la siguiente fecha: ", this.elements[z].dateLimit);
          console.log("[CONTROLLER MEETINGMINUTE: PDF] elements " + z + " tiene la siguiente fecha SPLIT 0 ", this.elements[z].dateLimit.split(' ')[0]);
          console.log("[CONTROLLER MEETINGMINUTE: PDF] elements " + z + " tiene la siguiente fecha SPLIT 1 ", this.elements[z].dateLimit.split(' ')[1]);

        } else if (this.elements[z].topic === i && this.elements[z].dateLimit.split(' ')[1] === ' ' ||
          this.elements[z].topic === i && this.elements[z].dateLimit.split(' ')[0] === ' ') {

          if (this.elements[z].type === 'compromiso') {
            desarrollo = desarrollo + '           ' + 'CO' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + 'sin fecha.' + '\n';
          }
          if (this.elements[z].type === 'duda') {
            desarrollo = desarrollo + '           ' + 'DU' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + 'sin fecha.' + '\n';
          }
          if (this.elements[z].type === 'acuerdo') {
            desarrollo = desarrollo + '           ' + 'AC' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + 'sin fecha.' + '\n';
          }
          if (this.elements[z].type === 'desacuerdo') {
            desarrollo = desarrollo + '           ' + 'DE' + ' ' + this.elements[z].number + '.' + this.elements[z].position + ': ' + this.elements[z].description + ', ' + this.elements[z].participants + ', ' + 'sin fecha.' + '\n';
          }


        }

      }

    }
    if (this.links.length === 0) {
      links = '     No hay adjuntos para esta acta.'
    }
    for (let i = 0; i < this.links.length; i++) {
      links = links + '     Link ' + i + ': ' + this.links[i] + '\n';
    }

    if (this.MeetingMinuteSelected.absents.length > 1) {
      
      const texto = this.projectSelected.shortName + ' - Reunion ' + this.MeetingMinuteSelected.number + '\n\n' + 'Objetivo: ' + this.MeetingMinuteSelected.name + '\n\n' + 'Lugar: ' + this.MeetingMinuteSelected.place + '\n\n' + 'Fecha y hora de llamado: ' + this.MeetingMinuteSelected.fechaI + ' Desde las ' + this.MeetingMinuteSelected.startHour + ' Hasta las ' + this.MeetingMinuteSelected.endHour + '\n\n' + 'Fecha y hora de inicio: ' + this.MeetingMinuteSelected.realStartTime + '\n\n' + 'Fecha y hora de término: ' + this.MeetingMinuteSelected.realEndTime + '\n\n' + 'Duración: ' + this.durationRealMeeting + ' minutos' + '\n\n' + 'Asistentes: ' + this.MeetingMinuteSelected.assistants + '\n\n' + 'Ausentes: '  + ausentes + '\n\n' + 'Compromisos previos: ' + '\n' + compromisesPrevies + '\n\n' + 'Desarrollo: ' + desarrollo + '\n' + 'Adjuntos: ' + '\n\n' + links + '\n\n';
      doc.setFont('arial');
      doc.setFontSize(8);
      doc.text(texto, 10, 10);
      doc.save(this.projectSelected.name + ' reunión ' + this.MeetingMinuteSelected.number + ' - meetflow.pdf');

    }
    else {
      const texto = this.projectSelected.shortName + ' - Reunion ' + this.MeetingMinuteSelected.number + '\n\n' + 'Objetivo: ' + this.MeetingMinuteSelected.name + '\n\n' + 'Lugar: ' + this.MeetingMinuteSelected.place + '\n\n' + 'Fecha y hora de llamado: ' + this.MeetingMinuteSelected.fechaI + ' Desde las ' + this.MeetingMinuteSelected.startHour + ' Hasta las ' + this.MeetingMinuteSelected.endHour + '\n\n' + 'Fecha y hora de inicio: ' + this.MeetingMinuteSelected.realStartTime + '\n\n' + 'Fecha y hora de término: ' + this.MeetingMinuteSelected.realEndTime + '\n\n' + 'Duración: ' + this.durationRealMeeting + ' minutos' + '\n\n' + 'Asistentes: ' + this.MeetingMinuteSelected.assistants + '\n\n' + 'Ausentes: ' + 'No hay ausentes' + '\n\n' + 'Compromisos previos: ' + '\n' + compromisesPrevies + '\n\n' + 'Desarrollo: ' + desarrollo + '\n' + 'Adjuntos: ' + '\n\n' + links + '\n\n';
      doc.setFont('arial');
      doc.setFontSize(8);
      doc.text(texto, 10, 10);
      doc.save(this.projectSelected.name + ' reunión ' + this.MeetingMinuteSelected.number + ' - meetflow.pdf');
    }


  }

  getUserProfile(userId: string) {
    this.authService.getUserProfile(userId).subscribe(
      async (resp) => {
        /*         console.log('RESPUESTA CUAL ES EL PERFIL DESLDE NAVBAR', resp); */

        this.userSelected = resp;

      },
      (err: { message: string | undefined }) => { }
    );
  }

  userSelected: any;


  switchModeDark() {
    this.isDarkMode = !this.isDarkMode;

    if (this.iconColor === "white" || this.cardColor === "rgb(39, 44, 49)" || this.titleColor === "white" || this.textColor === "rgb(194, 194, 194)") {
      this.titleColor = "black";
      this.cardColor = "white";
      this.textColor = "black";
      this.iconColor = "grey";
    }
    else {
      this.cardColor = "rgb(39, 44, 49)";
      this.titleColor = "white";
      this.textColor = "rgb(194, 194, 194)";
      this.iconColor = "white";
    }

    console.log('COLOR:', this.cardColor);
  }

  cardColor = "rgb(39, 44, 49)";
  titleColor = "white";

  textColor = "rgb(194, 194, 194)";
  iconColor = "white";

  public listNumbers1 = [''];
  public listNumbers2 = [''];

  rellenarListasPrueba() {
    this.listNumbers1 = [];
    this.listNumbers2 = [];

    /*    for(let index = 0; index<10; index++){
         this.listNumbers1.push(' ' + index );
   
       } */
    for (let index = 10; index < 20; index++) {
      this.listNumbers2.push(' ' + index);
    }


  }

  drop($event: CdkDragDrop<any[]>) {

    if ($event.previousContainer === $event.container) {
      moveItemInArray(
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      )
      // RECORREMOS TODOS LOS ELEMENTOS DE AQUI
      for (let agh = 0; agh < this.elements.length; agh++) {

        this.elements[agh].position = agh;
        /*    console.log(" ELEMENT " + agh, this.elements[agh]) */
        // POR CADA ELEMENTO VAMOS GUARDANDO SU POSICION
        // ACTUALIZAR LOS ELEMENTOS 
        /*      console.log("ACTUALIZANDO LA POSICION DEL ELEMENTO", this.elements[agh]); */
        this.authService
          .updateElement(
            this.elements[agh].description,
            this.elements[agh].topic,
            this.meetingSelectedId,
            this.elements[agh].type,
            this.projectSelectedId,
            this.MeetingMinuteSelected.number,
            this.elements[agh].participants,
            this.elements[agh].dateLimit,
            this.elements[agh]._id,
            agh,
            'yesSort'
          )
          .subscribe(
            (resp) => {

            },
            (err: any) => {

            }
          );
      }




    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex

      );
      /*  this.getCompromises(); */
    }
  }

  agregarAllMemeber() {

    this.MeetingMinuteSelected.participants = this.projectSelected.userMembers;

    this.saveMeetingMinute();
    setTimeout(() => {

      let payloadSave = {
        room: this.meetingSelectedId,
        user: this.user
      }
      this.socket.emit('event_reload', payloadSave);
      location.reload();
    }, 2000);
  }



  notificarInvitadosExternos(fase: string, emailExternal: string) {
    this.authService
      .notifyExternal(this.MeetingMinuteSelected, this.meetingSelectedId, fase, 'http://70.35.204.110:4200/#' + this.userSelected.lastLink, emailExternal)
      .subscribe(
        (resp) => {

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
            title: 'Se ha modificado el invitado exitosamente.'
          })
        },
        (err: any) => {
          console.log(err);
          Swal.fire('Error', err.message, 'error');
        }
      );
  }

  selectElementPosition: any;

  textPrueba = '';

  prueba1() {

  }
  private _opened: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  deleteElement(idElement: string) {
    this.authService
      .deleteElement(idElement)
      .subscribe(
        (resp) => {

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
            title: 'Se ha eliminado el elemento exitosamente.'
          })

          let payloadSave = {
            room: this.meetingSelectedId,
            user: this.user
          }

          this.getMeetingMinute(this.meetingSelectedId);
          setTimeout(() => {
            this.getCompromises('noSoft');
          }, 2000);

          this.socket.emit('event_element', payloadSave);
        },
        (err: any) => {
          console.log(err);
          Swal.fire('Error', err.message, 'error');
        }
      );
  }
  deleteAdjunto(position: number) {
    this.links.splice(position, 1);
    /* this.links[position] = ' '; */
    setTimeout(() => {
      this.saveMeetingMinute();
    }, 1000);


  }

  updateAdjuntoQuest(position: number) {
    Swal.fire({
      title: 'Modificación de adjunto',
      /*   text: 'Seleccionar un tipo de recordatorio.', */
      inputPlaceholder: 'Escribe el nuevo adjunto',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Actualizar url',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      denyButtonText: `Avanzado`,
      preConfirm: (nameAdjunto) => {
        if (nameAdjunto != '') {
          this.updateAdjunto(position, nameAdjunto);

        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      } else if (result.isDenied) {

      }
    });




  }

  updateAdjunto(position: number, newAdjunto: string) {
    this.links[position] = newAdjunto;
    setTimeout(() => {
      this.saveMeetingMinute();
    }, 1000);

  }

}
