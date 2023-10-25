import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.css'],
})
export class PreMeetingComponent {
  isMeetingMinute: boolean = true;
  projectSelectedId: string = '';
  meetingSelectedId: string = '';
  isState: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params: Params) => {
      /*         console.log('ESTE SON LOS PARAMETROS', params); */
      this.projectSelectedId = params['idP'];
      this.meetingSelectedId = params['idM'];

      this.authService.stateMeeting(params['idM']).subscribe(
        (resp: any) => {
          /*     console.log('ESTADO', resp.state); */

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
          if (resp.state === 'new') {
            this.isState = 'new';
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/pre-meeting';
            this.router.navigateByUrl(url2);
          }
          console.log('[PRE-MEETING] ESTADO DE LA REUNION: ', resp.state);
        },
        (err: string | undefined) => {
          Swal.fire('Error', err, 'error');
        }
      );
    });
  }

  pomg() {
    if (this.isMeetingMinute) {
      this.isMeetingMinute = false;
    } else {
      this.isMeetingMinute = true;
    }
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

  addInMeeting() {
    /*     console.log('addpremeeting'); */
    this.authService.addInMeeting(this.meetingSelectedId).subscribe(
      (resp: any) => {
        const url2 =
          '/main/' +
          this.projectSelectedId +
          '/meeting/' +
          this.meetingSelectedId +
          '/in-meeting';
        /*         console.log(this.projectSelectedId); */
        /*       this.router.navigateByUrl(url2); */

        /*         console.log('RESP 1:', resp); */

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
              /*             console.log(this.projectSelectedId); */
              this.router.navigateByUrl(url2);

              /*             console.log('RESP 1:', resp); */
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
}
