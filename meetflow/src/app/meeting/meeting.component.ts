import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent {
  projectSelectedId: string = '';
  meetingSelectedId: string = '';
  isFinish = false;
  isMeetingMinute = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    /*   this.listProjectsInicial();
      this.miFormulario.reset({ ...this.persona}); */

    /*  this.listMeetingsInicial("639add0a0292225f19c9c870"); */

    this.route.params.subscribe((params: Params) => {
      /*    console.log('ESTE SON LOS PARAMETROS', params); */
      this.projectSelectedId = params['idP'];
      this.meetingSelectedId = params['idM'];

      this.authService.stateMeeting(params['idM']).subscribe(
        (resp: any) => {
          /*        console.log('ESTADO', resp.state); */
          if (resp.state === 'finish') {
            this.isFinish = true;
          }
          if (resp.state === 'pre-meeting') {
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/pre-meeting';
            this.router.navigateByUrl(url2);
          }
          if (resp.state === 'in-meeting') {
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/in-meeting';
            this.router.navigateByUrl(url2);
          }
          if (resp.state === 'post-meeting') {
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/post-meeting';
            this.router.navigateByUrl(url2);
          } else {
            console.log("ENTRO AQUI DESDE MEETING");
            /* this.addPreMeeting(); */
          }

        },
        (err: string | undefined) => {
          /*    Swal.fire('Error', err, 'error'); */
        }
      );
    });
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

  addPreMeeting() {
    /*  console.log('addpremeeting'); */
    this.authService.addPreMeeting(this.meetingSelectedId).subscribe(
      (resp: any) => {
        const url2 =
          '/main/' +
          this.projectSelectedId +
          '/meeting/' +
          this.meetingSelectedId +
          '/pre-meeting';
        /*  console.log(this.projectSelectedId); */
        /*       this.router.navigateByUrl(url2); */

        /*     console.log('RESP 1:', resp); */

        this.authService.setStateMeeting('new', this.meetingSelectedId).subscribe(
          (resp: any) => {
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/pre-meeting';
            /*       console.log(this.projectSelectedId); */
            this.router.navigateByUrl(url2);

            /*        console.log('RESP 1:', resp); */
          },
          (err: string | undefined) => {
            /*    Swal.fire('Error', err, 'error'); */
          }
        );
      },
      (err: string | undefined) => {
        /*       Swal.fire('Error', err, 'error'); */
      }
    );
  }

  /* addMeeting(){
    this.authService.addPreMeeting().subscribe((resp: any) => {

      console.log("RESP 1:", resp);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Reunion creada correctamente',
        showConfirmButton: false,
        timer: 800
      })


      this.authService.meeting(this.projectSelectedId).subscribe((resp: any) => {

        console.log("RESP 2", resp);

        this.meetings = resp;
        this.countMeetings = this.meetings.length;
      
         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'reuniones cargadas correctamente',
          showConfirmButton: false,
          timer: 1000
        })  
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
 */




}
