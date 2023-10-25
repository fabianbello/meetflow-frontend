import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-in-meeting',
  templateUrl: './in-meeting.component.html',
  styleUrls: ['./in-meeting.component.css']
})
export class InMeetingComponent {

  isMeetingMinute: boolean = true;

  projectSelectedId: string = '';
  meetingSelectedId: string = '';

  constructor( private router: Router,    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute){

    this.route.params.subscribe((params: Params) => {
      console.log('ESTE SON LOS PARAMETROS', params);
      this.projectSelectedId = params['idP'];
      this.meetingSelectedId = params['idM'];});

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

  pomg(){
    if(this.isMeetingMinute){
      this.isMeetingMinute = false;
    }
   else{
    this.isMeetingMinute = true;
   }
  }

  addPostMeeting() {
    console.log('addpremeeting');
    this.authService.addInMeeting(this.meetingSelectedId).subscribe(
      (resp: any) => {
        const url2 =
          '/main/' +
          this.projectSelectedId +
          '/meeting/' +
          this.meetingSelectedId +
          '/in-meeting';
        console.log(this.projectSelectedId);
  /*       this.router.navigateByUrl(url2); */

        console.log('RESP 1:', resp);

        this.authService.setStateMeeting('post-meeting', this.meetingSelectedId ).subscribe(
          (resp: any) => {
            const url2 =
              '/main/' +
              this.projectSelectedId +
              '/meeting/' +
              this.meetingSelectedId +
              '/post-meeting';
            console.log(this.projectSelectedId);
            this.router.navigateByUrl(url2);

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

}
