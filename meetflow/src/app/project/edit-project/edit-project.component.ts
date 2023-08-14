import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { Socket } from 'ngx-socket-io';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')


@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent {
  miFormulario: FormGroup = this.fb.group({
    shortName: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(6)]],
    fechaI: ['', []],
    fechaT: ['', []],
  });

  idProyect: any = ' ';

  projectSelected: any = {
    name: '',
  };

  isEditable = false;

  projectSelectedDateI: any;
  projectSelectedDateT: any;
  isOwner: boolean = false;
  isMember: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private socket: Socket) {
    // AQUI PARA RECARGAR LA PAGINA
    socket.fromEvent('new_save_project').subscribe(async (user: any) => {

      console.log('USUARIO SOY YO GUARDANDO: ', user);

      console.log('USUARIO guardando projecto: ', user);
      this.getProjectId();

    });



  }
  user: any;
  ngOnInit(): void {
    this.idProyect = this.route.snapshot.paramMap.get('id');
    // _________________________________________________________
    // PRIMERO SABEMOS CUAL ES EL USUARIO?
    // _________________________________________________________
    this.authService.userLogin().subscribe(
      async (resp) => {
        this.user = resp;

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
    this.getProjectId();
  }

  getProjectId() {
    this.authService.projectById(this.idProyect).subscribe(
      async (resp) => {
        /*    console.log(resp); */
        this.projectSelected = resp;
        /*     console.log("RESPUESTA FECHA!: ", resp); */

        /* this.router.navigateByUrl('/main/add-project'); */

        this.miFormulario.patchValue(this.projectSelected);
        setTimeout(() => {
          console.log("SOY: ", this.user.email);

          let result = this.projectSelected.userOwner.filter((role: any) =>
            role.includes(this.user.email)
          );

          let result2 = this.projectSelected.userMembers.filter((role: any) =>
            role.includes(this.user.email)
          );

          /*  console.log("RESULTADO!", result.length); */
          if (result.length > 0 ) {
            console.log("ES LIDER");
            this.isOwner = true;
          } else if(result2.length > 0) {
            console.log("ES MIEMBRO")
            this.isMember = true;
          }
          /*  Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'informacion del proyecto: ',
          text: resp.name,
          showConfirmButton: false,
          timer: 1000,
        }); */
        }, 1000);
      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
  }

  saveProject() {

    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);

    /* this.authService.validarToken()
    .subscribe(resp=> console.log(resp)); */

    const { shortName, name, description, fechaI, fechaT } =
      this.miFormulario.value;
    console.log(name);
    console.log(description);
    console.log('FECHA INICIO: ', fechaI);
    console.log('FECHA TERMINO: ', fechaT);
    this.authService
      .saveProject(shortName, name, description, fechaI, fechaT, this.idProyect, this.projectSelected.userOwner, this.projectSelected.userMembers)
      .subscribe(
        async (resp) => {
          /*  console.log(resp); */
          /* this.router.navigateByUrl('/main/add-project'); */
          this.projectSelected = resp;

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
            title: 'Se ha guardado el proyecto exitosamente.'
          })

          let payload = {
            room: this.idProyect,
            user: 'a',
          };
          this.socket.emit('event_save_project', payload);
          this.isEditable = false;

          setTimeout(() => {
            this.getProjectId();

          }, 1000);
        },
        (err: { message: string | undefined }) => {
          Swal.fire('Error', err.message, 'error');
        }
      );

    /* this.router.navigateByUrl('/dashboard'); */
  }

  editable() {
    this.isEditable = !this.isEditable;
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
        setTimeout(() => {
          this.router.navigateByUrl('/main');
        }, 2000);
        setTimeout(() => {
          location.reload();
        }, 2000);
      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
  }

  addMember() {
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
        console.log('PROJECTO: ', this.projectSelected);
        this.createMember(emailMember, this.projectSelected._id);
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

  createOwner(nameOwner: string) { }

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
              this.projectSelected.userMembers.push(emailMember);

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
                title: 'Se ha guardado el proyecto exitosamente.' + emailMember
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



  campoEsValido(campo: string) {
    return (
      this.miFormulario.controls[campo].errors &&
      this.miFormulario.controls[campo].touched
    );
  }

  async modificarMember(member: any) {
    console.log("MIEMBRO: ", member);
    const { value: modification } = await Swal.fire({
      title: 'Modificar usuario',
      input: 'select',
      inputOptions: {
        modificación: {
          miembro: 'Miembro',
          lider: 'Lider',
          eliminar: 'Eliminar',
        },
      },
      inputPlaceholder: 'Seleccionar la modificación al usuario',
      showCancelButton: true,
      showDenyButton: true,
    });

    if (modification === 'lider') {
      this.projectSelected.userOwner.push(member);
      let pos = this.projectSelected.userMembers.indexOf(member);
      console.log('POSICIOIN A ELIMINAR: ', pos);
      this.projectSelected.userMembers.splice(pos, 1);

      setTimeout(() => {
        this.saveProject();
        /*  this.socket.emit('event_reload', payloadSave); */
        /* location.reload(); */
      }, 2000);
      /*  this.setRoleUser(id, user.value, modification, roleUser); */
    } else if (modification === 'miembro') {
      this.projectSelected.userMembers.push(member);
      let pos = this.projectSelected.userOwner.indexOf(member);
      console.log('POSICIOIN A ELIMINAR: ', pos);
      this.projectSelected.userOwner.splice(pos, 1);





      setTimeout(() => {
        this.saveProject();
        /*  this.socket.emit('event_reload', payloadSave); */
        /* location.reload(); */
      }, 2000);
    } else if (modification === 'eliminar') {
      let pos = this.projectSelected.userOwner.indexOf(member);
      console.log('POSICIOIN A ELIMINAR: ', pos);
      this.projectSelected.userOwner.splice(pos, 1);
      let pos2 = this.projectSelected.userMembers.indexOf(member);
      console.log('POSICIOIN A ELIMINAR: ', pos2);
      this.projectSelected.userMembers.splice(pos2, 1);
      setTimeout(() => {
        this.saveProject();
        /*  this.socket.emit('event_reload', payloadSave); */
        /* location.reload(); */
      }, 2000);

    }

  }


}
