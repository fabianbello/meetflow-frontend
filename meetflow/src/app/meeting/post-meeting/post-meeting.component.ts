import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-post-meeting',
  templateUrl: './post-meeting.component.html',
  styleUrls: ['./post-meeting.component.css']
})
export class PostMeetingComponent {
  isMeetingMinute: boolean = true;

  constructor(private router: Router,   private authService: AuthService) { }

  pomg() {
    if (this.isMeetingMinute) {
      this.isMeetingMinute = false;
    }
    else {
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

}
