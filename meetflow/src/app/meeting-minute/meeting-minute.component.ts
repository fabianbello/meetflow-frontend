import { Component, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-meeting-minute',
  templateUrl: './meeting-minute.component.html',
  styleUrls: ['./meeting-minute.component.css'],
})
export class MeetingMinuteComponent {
  /*   artifact = {
    specification: '',
    mode: '',
    responsible: '',
  };

  topics: string[] = []; */
  vacio: string = '         ';
  first: boolean = true;
  links = [' '];

  realDuration = {
    time: new Date()
  }

  desplega = false;

  listaCantForTopic = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  isEditable = false;
  projectSelectedId: string = '';
  projectSelected: any = '';
  meetingSelectedId: string = '';
  meetingSelectedStatus: string = '';
  isAvailableDialog: boolean = false;
  state: string = 'instancia';
  isSecretary = false;
  isParticipant = false;
  selectTopic = -1;
  selectElementId = '';
  numerExperimental = 0;

  closeResult: string | undefined;


  MeetingMinuteSelected = {
    id: '',
    name: '',
    place: '',
    fechaI: new Date(),
    fechaT: new Date(),
    startHour: '00:00',
    endHour: '00:00',
    realStartTime: '',
    realEndTime: '',
    meeting: '',
    topics: [],
    participants: [''],
    assistants: [''],
    secretaries: [''],
    leaders: [''],
    number: 0,
    links: [],

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
  typesElements = ['compromiso', 'duda', 'acuerdo', 'desacuerdo', 'texto libre'];
  user: any;
  isNew = false;
  elementsPreviews: any[] = [''];

  colapseArrayBol: any[] = [false, false, false, false, false, false, false, false, false, false];
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
    this.resetNumberExperimenta(0);

    //! AQUI VAMOS SUMANDO A LOS NUEVOS

    socket.fromEvent('new_save').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
        console.log('USUARIO SOY YO GUARDANDO: ', user);
      } else {
        console.log('USUARIO GUARDANDO: ', user);
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
        console.log('USUARIO SOY YO GUARDANDO: ', user);
      } else {
        console.log('USUARIO NUEVO TEMA: ', user);
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
        console.log('USUARIO SOY YO GUARDANDO: ', user);
      } else {
        console.log('USUARIO GUARDANDO: ', user);
        this.getMeetingMinute(this.meetingSelectedId);
        let stringAux2 = user.email
        this.getCompromises();
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
        console.log('USUARIO SOY YO GUARDANDO: ', user);
      } else {
        setTimeout(() => {
          location.reload();
        }, 10000);
        console.log('USUARIO RECARGANDO: ', user);

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



      }
    });

    this.authService.userLogin().subscribe(
      async (resp) => {
        this.user = resp;
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


              /*               console.log('ESTADO? : ', resp);
              console.log('ESTADO', resp.state); */

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
                this.getCompromises();
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

          Swal.fire(
            'Error',
            'Usuario no autorizado para ver el acta dialógica',
            'error'
          );
        }
      }
    );








  }
  // _________________________________________________________
  // NG ON
  // _________________________________________________________
  ngOnInit(): void {
    this.resetNumberExperimenta(0);
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
      fechaT: ['', []],
      startHour: ['', []],
      endHour: ['', []],
      topics: this.fb.array([], Validators.required),
      participants: this.fb.array([], Validators.required),
      secretaries: this.fb.array([], Validators.required),
      leaders: this.fb.array([], Validators.required),
    });

    this.elementForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(6)]],
      type: ['', [Validators.required, Validators.minLength(6)]],
      participants: ['', []],
      topic: ['', []],
      number: ['', []],
      dateLimit: ['', []],
    });

    this.elementEditForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(6)]],
      type: ['', [Validators.required, Validators.minLength(6)]],
      participants: ['', []],
      topic: ['', []],
      number: ['', []],
      dateLimit: ['', []],
    });



    this.newTopics = this.fb.control('', Validators.required);
    this.newParticipants = this.fb.control('', Validators.required);
    this.newTopicsDescription = this.fb.control('', Validators.required);
    this.newSecretaries = this.fb.control('', Validators.required);
    this.newLeaders = this.fb.control('', Validators.required);

  }

  /* FUNICONES */




  campoEsValido(campo: string) {
    if (this.meetingMinuteForm.controls[campo].touched && this.meetingMinuteForm.controls[campo].dirty) {
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
      title: 'Agregar un nuevo usuario',
      input: 'select',
      inputOptions: {
        'Miembros del proyecto': this.projectSelected.userMembers,
      },
      inputPlaceholder: 'Seleccionar un nuevo participante',
      showCancelButton: true,
      confirmButtonText: 'Añadir como Participante',
      showDenyButton: true,
      denyButtonText: `Manual`,
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
          title: 'Equipo de proyecto',
          text: '¿Email del usuario?',
          input: 'email',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Añadir como Participante',

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
      denyButtonText: `Manual`,
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
              'El correo electrónico ingresado no pertenece a ningún usuario de la plataforma.',
            icon: 'error',
          });

        } else {
          this.participantArr.push(new FormControl(emailMember));
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
        title: 'Debe haber al menos un lider en la reunión',
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
      title: 'Modificar usuario',
      input: 'select',
      inputOptions: {
        Rol: {
          secretario: 'Secretario',
          participante: 'Participante',
          lider: 'Lider'
        },
      },
      inputPlaceholder: 'Seleccionar la modificación al usuario',
      showCancelButton: true,
    });

    if (modification) {
      this.setRoleUser(id, user.value, modification, roleUser);
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
      if (modification == 'secretario') {
        this.secretaryArr.push(
          new FormControl(user)
        );
        if (roleUser === 'participante') {
          this.participantArr.removeAt(id);
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
        this.leaderArr.push(
          new FormControl(user)
        );
        if (roleUser === 'secretario') {
          this.secretaryArr.removeAt(id);
        }
        if (roleUser === 'participante') {
          this.participantArr.removeAt(id);
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
    }
  }

  getMeetingMinute(meetingSelectedId: string) {
    /*     console.log('MEETING MINUTE', meetingSelectedId); */


    this.authService.getMeetingMinute(this.meetingSelectedId).subscribe(
      async (resp) => {
        console.log('[MEETING MINUTE] FUNCION getMeetingMinute() : ', resp);
        if (resp.length === 0) {
          /* this.isAvailableCreate = true; */
          /*  console.log('ENTRAMSO AQUI?', resp); */
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
          console.log("FECHA REAL", this.MeetingMinuteSelected.realEndTime);
          console.log("ESTA ES EL ACTA OBTENIDA: ", resp);
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
          if (result.length > 0 || result2.length > 0) {
            this.isSecretary = true;
            this.isParticipant = true;
          } else if (result3.length > 0) {
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
    /*  console.log('MEETING MINUTE', meetingSelectedId); */

    // _________________________________________________________
    //  BUSCAMOS EL ACTA EN BASE A LA REUNION SELECCIONADA
    // _________________________________________________________
    this.authService.getMeetingMinute(this.meetingSelectedId).subscribe(
      async (resp) => {
        console.log('[MEETING MINUTE] FUNCION getMeetingMinute2() : ', resp);
        /*     console.log('RESPUESTAAAAAAAAA', resp); */
        /* console.log(
          'ESTO ES PARA SABER SI DEBERIA CREARSE DESDE 0 UNA NUEVA ACTA DIALOGICA',
          resp
        ); */

        // _________________________________________________________
        // SI NO HAY ACTA DIALOGICA ASOCIADA A LA REUNION ENTONCES LA CREAMOS
        // _________________________________________________________
        /* console.log('REALMENTE EL LARGO ES 0?', resp.length);
        console.log(
          'SE ENCONTRO ESA ACTA DIAGOLICA BUSCANDO A PARTIR DE ESTA REUNION: ',
          this.meetingSelectedId
        ); */
        if (resp.length === 0) {
          /* this.isAvailableCreate = true; */
          /*  console.log(
            'EFECTIVAMENTE HAY QUE CREAR UNA NUEVA ACTA DIALOGICA',
            resp.length
          ); */

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
                /*   console.log('RESPUESTA', resp);
                console.log('RESPUESTA id', resp.id); */
                /* this.router.navigateByUrl('/main/add-project'); */
                this.isAvailableCreate = false;
                this.isAvailableSave = true;

                /*            Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Se ha creado el acta dialogica: ',
                  text: resp.title,
                  showConfirmButton: false,
                  timer: 2000,
                }); */
                /*         this.meetingMinuteForm.reset(); */

                /*   console.log("SE CREO EL ACTA DIALOGICA NUEVA?", resp); */
                setTimeout(() => {
                  this.getMeetingMinute2(this.meetingSelectedId);
                }, 2000);
              },
              (err: { message: string | undefined }) => {
                console.log('NO SE PUDO CREAR EL ACTA DIALOGICA');
              }
            );
        } else {
          /*       const { name, place, fechaI, fechaT, topics } = resp; */
          /*  console.log('RESPUESTA', resp); */
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
          console.log("FECHA REAL", this.MeetingMinuteSelected.realEndTime);

          this.links = resp[0].links;

          /* console.log(
            'RESPUESTA DE MEETING MINUTE',
            this.MeetingMinuteSelected
          ); */
          /*  console.log('PARTICIPANTES', this.MeetingMinuteSelected.participants); */
          this.isAvailableCreate = false;
          this.isAvailableSave = true;
          this.meetingMinuteForm.patchValue(this.MeetingMinuteSelected);
          let i = 0;
          /* console.log(
            'CUENTA TOPICOS:',
            this.MeetingMinuteSelected.topics.length
          ); */

          while (i < this.MeetingMinuteSelected.topics.length) {
            this.topicArr.push(
              new FormControl(
                this.MeetingMinuteSelected.topics[i],
                Validators.required
              )
            );
            i++;
          }

          let x = 0;

          while (x < this.MeetingMinuteSelected.participants.length) {
            this.participantArr.push(
              new FormControl(
                this.MeetingMinuteSelected.participants[x],
                Validators.required
              )
            );
            x++;
          }
          let f = 0;

          while (f < this.MeetingMinuteSelected.secretaries.length) {
            this.secretaryArr.push(
              new FormControl(
                this.MeetingMinuteSelected.secretaries[f],
                Validators.required
              )
            );
            f++;
          }

          let l = 0;
          while (l < this.MeetingMinuteSelected.leaders.length) {
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
          /*     location.reload(); */

          /*           if(this.MeetingMinuteSelected.participants.length === 0){
            this.participantArr.push(
              new FormControl(
                this.MeetingMinuteSelected.participants[0],
                Validators.required
              )
            );

          } */
          if (
            this.MeetingMinuteSelected.secretaries.length === 0 &&
            this.first
          ) {
            this.first = false;
            this.secretaryArr.push(
              new FormControl(
                this.MeetingMinuteSelected.secretaries[0],
                Validators.required
              )
            );
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
          if (result.length > 0 || result2.length > 0) {
            this.isSecretary = true;
            this.isParticipant = true;
          } else if (result3.length > 0) {
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
    this.getMeetingMinute(this.meetingSelectedId);
    let { name, place, fechaI, fechaT, startHour, endHour, topics, participants, secretaries, leaders } =
      this.meetingMinuteForm.value;
    /* console.log(name);
    console.log(place);
    console.log(fechaI);
    console.log(fechaT);
    console.log('TEMAS', topics); */
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
        participants,
        secretaries,
        leaders,
        this.links,
        this.MeetingMinuteSelected.realStartTime,
        this.MeetingMinuteSelected.realEndTime
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
      /*       denyButtonText: `Avanzado`, */
      preConfirm: (description) => {
        this.crearCompromiso(description, id);
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



          /*  console.log('RESPUESTAAAAAAA DE CREACION DE COMPROMISO', resp);
          console.log('ID DE COMPROMISO: ', resp._id); */
        },
        (err: any) => {
          /*   console.log(err); */
          /* Swal.fire('Error', err.message, 'error'); */
        }
      );
  }

  crearElemento() {

    let { description, type, participants, topic, number, dateLimit } =
      this.elementForm.value;
    /*     let newTopic; */
    /*     console.log( "ELEMENTO DESCIRIPCION: ", description);
        console.log( "ELEMENTO type: ", type);
        console.log( "ELEMENTO participants: ", participants);
        console.log( "ELEMENTO topic: ", topic);
        console.log( "ELEMENTO dateLimit: ", dateLimit); */

    if (topic === '' || topic === null) {

      let newTopic = this.selectTopic;

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
              title: 'Se ha creado el elemento exitosamente.'
            });
            this.elementForm.reset();
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

            /*     this.elements = [
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
                ]; */

            this.listaCantForTopic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.getCompromises();



            this.socket.emit('event_element', payloadSave);



            /*  console.log('RESPUESTAAAAAAA DE CREACION DE COMPROMISO', resp);
            console.log('ID DE COMPROMISO: ', resp._id); */
          },
          (err: any) => {
            /*   console.log(err); */
            /* Swal.fire('Error', err.message, 'error'); */
          }
        );

    } else if (topic != '' && topic != null) {

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
              title: 'Se ha creado el elemento exitosamente.'
            });
            this.elementForm.reset();
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
            this.getCompromises();
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
        this.selectElementId
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
          this.getCompromises();
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



  getCompromises() {
    /*  this.resetNumberExperimenta(0); */
    this.authService.getCompromises(this.meetingSelectedId).subscribe(
      (resp: any[]) => {
        console.log(resp);
        /*  this.listProjectsInicial(); */

        let pro = 0;
        let relativ = 0;
        let numTopics = 0;
        // CREAMOS UN ARREGLO CON LA CANTIDAD POR TEMA

        this.elements = resp;

        for (let z = 0; z < resp.length; z++) {
          for (let topic = 0; topic < this.MeetingMinuteSelected.topics.length; topic++) {
            if (resp[z].topic === topic) {
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
            }
          }
        }

        // RECORREMOS NUEVAMENTE Y ASIGNAMOS POSICION
        for (let oo = 0; oo < resp.length; oo++) {
          for (let topico = 0; topico < this.listaCantForTopic.length; topico++) {

            if (resp[oo].topic === topico) {

              /*    this.elements[oo].position = this.listaCantForTopic[topico]; */

              if (resp[oo].topic === 1) {
                this.elements[oo].position = this.elements[oo].position + this.listaCantForTopic[0];

              }
              if (resp[oo].topic === 2) {
                this.elements[oo].position = this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1];

              }
              if (resp[oo].topic === 3) {
                this.elements[oo].position = this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2];

              }
              if (resp[oo].topic === 4) {
                this.elements[oo].position = this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2] + this.listaCantForTopic[3];

              }
              if (resp[oo].topic === 5) {
                this.elements[oo].position = this.elements[oo].position + this.listaCantForTopic[0] + this.listaCantForTopic[1] + this.listaCantForTopic[2] + this.listaCantForTopic[3] + this.listaCantForTopic[4];

              }

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
        /*      console.log('AQUI ESTAN LOS COMPROMISOS ANTERIORES', resp); */
        /*  this.listProjectsInicial(); */
        this.elementsPreviews = resp;
        if (resp.length === 0) {
          this.elementsPreviews = ['no hay'];
        }
        /*         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'se han cargado los elementos ',
          showConfirmButton: false,
          timer: 2000,
        }); */
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
      title: 'Agregar un responsable',
      input: 'select',
      inputOptions: {
        'Participantes': this.MeetingMinuteSelected.participants,
      },
      inputPlaceholder: 'Seleccionar un responsable',
      showCancelButton: true,
      confirmButtonText: 'Asignar como responsable',
      showDenyButton: true,
      denyButtonText: `Manual`,
      preConfirm: (user) => {
        this.crearResponsbile(this.MeetingMinuteSelected.participants[user], numberOrder);
        /*         this.createMember(emailMember, this.projectSelected._id); */
      },
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Añadir responsable',
          text: '¿Email del usuario?',
          input: 'email',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Asignar responsable',

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
                  title: 'Se ha añadido el responsable ' + user + ' exitosamente.'
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
      input: 'url',
      title: 'Ingresar un link de pagina web valido',
      inputPlaceholder: 'Escribir URL completa',
    });

    if (url) {
      Swal.fire(`URL añadida: ${url}`);
      this.links.push(url);
      setTimeout(() => {
        this.saveMeetingMinute();
      }, 1000);
    }

  }

  notificarParticipantes(fase: string) {
    this.authService
      .notifyParticipants(this.MeetingMinuteSelected, this.meetingSelectedId, fase, this.user.lastLink)
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
            title: 'Se ha modificado el participante exitosamente.'
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
    this.MeetingMinuteSelected.realStartTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
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
    this.MeetingMinuteSelected.realEndTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
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
    this.MeetingMinuteSelected.realStartTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    const { value: accept } = await Swal.fire({
      title: 'Concluyendo creación de reunión',
      input: 'checkbox',
      inputValue: 1,
      inputPlaceholder:
        '¿Enviar notificación a participantes?',
      confirmButtonText:
        'Continuar a Pre-Reunión <i class="fa fa-arrow-right"></i>',

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
    this.MeetingMinuteSelected.realStartTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    console.log("real start time", this.MeetingMinuteSelected.realStartTime);
    /*  Swal.fire({ html: `You selected:` }) */
    const { value: accept } = await Swal.fire({
      title: 'Concluyendo Pre-Reunión',
      input: 'checkbox',
      inputValue: 1,
      inputPlaceholder:
        '¿Enviar notificación a participantes?',
      confirmButtonText:
        'Continuar a En-Reunión <i class="fa fa-arrow-right"></i>',
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
  }

  async nextFasePost() {
    this.MeetingMinuteSelected.realEndTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    console.log("real end time", this.MeetingMinuteSelected.realEndTime);

    const { value: accept } = await Swal.fire({
      title: 'Concluyendo En-Reunión',
      input: 'checkbox',
      inputValue: 1,
      inputPlaceholder:
        '¿Enviar notificación a participantes?',
      confirmButtonText:
        'Continuar a Post-Reunión <i class="fa fa-arrow-right"></i>',

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


  async nextFasePostCreate() {

    const { value: accept } = await Swal.fire({
      title: 'Concluyendo En-Reunión',
      input: 'checkbox',
      inputValue: 1,
      inputPlaceholder:
        '¿Enviar notificación a participantes?',
      confirmButtonText:
        'Continuar a crear nueva reunión <i class="fa fa-arrow-right"></i>',

    })

    if (accept) {
      this.notificarParticipantes('creación de reunión');
      this.saveMeetingMinute();
      setTimeout(() => {
        this.addMeeting();

      }, 2000);
    }
    else {
      this.saveMeetingMinute();
      setTimeout(() => {
        this.addMeeting();
      }, 2000);

    }

  }


  editable() {
    this.isEditable = !this.isEditable;
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

  openScrollableContent(longContent: any, numTopic: number) {
    this.selectTopic = numTopic;
    /*     this.resetNumberExperimenta(this.numerExperimental); */
    this.modalService.open(longContent, { scrollable: true, modalDialogClass: 'dark-modal' });
  }

  openScrollableContent2(longContent2: any, numTopic: number, element: any) {
    /*     this.resetNumberExperimenta(this.numerExperimental); */
    /*     this.numerExperimental = 0; */
    console.log("ELEMNTO PARA ACTUALIZAR: ", element)
    this.selectTopic = numTopic;
    this.selectResponsable = element.participants;
    this.selectElementId = element._id;
    this.elementEditForm.patchValue(element);
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
    /*     const url2 = '/main/' + this.projectSelectedId + '/add-meeting'; */
    /*     console.log(this.projectSelectedId); */
    /*     this.router.navigateByUrl(url2); */
    /*     console.log(this.countMeetings); */



    this.authService
      .addMeeting(this.projectSelectedId, this.MeetingMinuteSelected.number)
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
          title: 'Visualización Microservice-tasks estado:',
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
            title: 'Visualización Microservice-taks estado:',
            text: 'en desarrollo'
          })
          /*   console.log(err); */
          /* Swal.fire('Error', err.message, 'error'); */
        }
      );

  }


}
