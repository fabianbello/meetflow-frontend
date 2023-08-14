import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

//!-------------------------------------
//! WEB SOCKET 1
//!------------------------------------
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  collapsed: boolean = false;
  projectSelectedId: string = '';
  meetingSelectedId: string = '';

  user: any;
  userSelected: any;
  nameSplit: any;
  nameTag: any;
  tagName: any;

  colorTag: any;
  @Input() newParticipants: any = [];
  newParticipantsName: any = [];
  newParticipantsColor: any = [];
  userRol: string = 'Sin rol';
  stringAux: string = '';

  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  // EMITER RECIBIDO
  @Input() nameProjectEmite: string = 'Sin Asignar';
  @Input() nameMeetingEmite: string = 'Sin Asignar';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private socket: Socket
  ) {

    // AQUI PARA RECARGAR LA PAGINA
    socket.fromEvent('new_reload').subscribe(async (user: any) => {
      if (user.email === this.user.email) {
        console.log('USUARIO SOY YO GUARDANDO: ', user);
      } else {
        console.log('USUARIO RECARGANDO: ', user);
        location.reload();
        let stringAux2 = user.email
      }
    });

    this.eventEmit();

    //! AQUI VAMOS QUITANDO A LOS QUE SE VAN

    /* socket.fromEvent('left_user').subscribe((user: any) => {
      console.log('USUER SALIENDOSE: ', user);
      
      let stringAux3 = '' + user.name + ',' + user.color;
      let pos = this.newParticipants.indexOf(stringAux3);
      console.log('POSICIOIN A ELIMINAR: ', pos);
      this.newParticipants.splice(pos, 1);

      console.log('USUARIOS: ', this.newParticipants);
    }); */
  }
  //!------------------------------------
  //! WEB SOCKET 2
  //!------------------------------------

  //* ENVIAR MENSAJE DESDE BACKEND
  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  //* RECIBIR MENSAJE DESDE BACKEND
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data.msg));
  }

  //!------------------------------------
  //! WEB SOCKET 3 PRUEBA DE EMITIR MENSAJE A BACK
  //!------------------------------------

  eventEmit() {
    this.authService.userLogin().subscribe(
      async (resp) => {
        console.log('[NAVBAR] CUAL ES EL USUARIO?', resp);
        this.user = resp;

        this.authService.getUserProfile(resp.id).subscribe(
          async (resp2) => {
            /* console.log('[NAVBAR] TODO LO QUE SOY', resp2); */

            this.userSelected = resp2;
            this.userSelected.password = '';
            this.tagName = resp2.tagName;
            this.nameSplit = resp2.name.split(' ');
            let firstName = this.nameSplit[0][0];
            let secondName = this.nameSplit[1][0];
            this.nameTag = firstName + ' ' + secondName;
            //TODO
            //TODO

            this.colorTag = resp2.color;
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
              /*  this.joinRoom('all') */
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

  tagForm!: FormGroup;

  ngOnInit(): void {
    this.tagForm = this.fb.group({
      color: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  //! ENTRADA DE USUARIO!
  async joinRoom(id: string) {
    /*   console.log("ENVIANDO ESTE USUARIO AL BACKEND:", this.userSelected); */
    let payloadJoin = {
      room: id,
      user: this.userSelected,
    };
    await this.socket.emit('event_join', payloadJoin);
  }

  logoutUser() {
    localStorage.removeItem('token');
    /*     this.logged = false; */
    this.router
      .navigate(['/dashboard'])

      .then(() => {
        window.location.reload();
      });
  }

  SideNavToggle() {
    this.menuStatus = !this.menuStatus;
    console.log('MENU STATUS: ', this.menuStatus);
    this.sideNavToggled.emit(this.menuStatus);
  }

  getUserProfile(userId: string) {
    this.authService.getUserProfile(userId).subscribe(
      async (resp) => {
        console.log('[NAVBAR] TODO LO QUE SOY', resp);

        this.userSelected = resp;
        this.userSelected.password = '';

        setTimeout(() => { }, 2000);
      },
      (err: { message: string | undefined }) => { }
    );
  }


  async setColor2(color: string) {

    this.colorTag = color;

    this.authService.saveUserColor(this.user.id, color).subscribe(
      async (resp) => {
        /*     console.log('[NAVBAR] SE GUARDO COLOR?', resp); */
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
          title: 'Se ha guardado el color exitosamente.'
        })

        setTimeout(() => {
          this.getUserProfile(this.user.id);
          let payloadSave = {
            room: this.userSelected.currentProjectId,
            user: this.userSelected
          }
          let payloadSave2 = {
            room: this.userSelected.currentMeetingId,
            user: this.userSelected
          }
          this.socket.emit('event_reload', payloadSave);
          this.socket.emit('event_reload', payloadSave2);
          location.reload()
          /* this.joinRoom(this.userSelected.currentMeetingId); */

        }, 1000);
      },
      (err: { message: string | undefined }) => { }
    );
  }

  async setColor() {

    let { color } = this.tagForm.value;
    this.colorTag = color;



    /*     const { value: email } = await Swal.fire({
      title: 'Input email address',
      input: 'email',
      inputLabel: 'Your email address',
      inputPlaceholder: 'Enter your email address',
    });

    if (email) {
      Swal.fire(`Entered email: ${email}`);
    }
     */
    /*     console.log(
      '[NAVBAR] COLOR A ENVIAR A SAVEUSER COLOR: ',
      this.tagForm.value.color
    ); */

    this.authService.saveUserColor(this.user.id, color).subscribe(
      async (resp) => {
        /*     console.log('[NAVBAR] SE GUARDO COLOR?', resp); */
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
          title: 'Se ha guardado el color exitosamente.'
        })
        setTimeout(() => {
          this.getUserProfile(this.user.id);
          let payloadSave = {
            room: this.userSelected.currentProjectId,
            user: this.userSelected
          }
          let payloadSave2 = {
            room: this.userSelected.currentMeetingId,
            user: this.userSelected
          }
          this.socket.emit('event_reload', payloadSave);
          this.socket.emit('event_reload', payloadSave2);
          location.reload()
          /* this.joinRoom(this.userSelected.currentMeetingId); */

        }, 1000);
      },
      (err: { message: string | undefined }) => { }
    );
  }


  showUser(user: any) {
    console.log("ESTE ES EL USUARIO CLICKEADO: ", user);
    let userName = user.split(',')[2];
    let userEmail = user.split(',')[3];
    let userInstitution = user.split(',')[4];

    Swal.fire(userName + '\n' + userEmail + '\n' + userInstitution);

  }
}
