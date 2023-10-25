import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: any;
  countUsers: any;
  countMeetings: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private socket: Socket
  ) {
    this.authService.userLogin().subscribe(
      async (resp) => {
        this.user = resp;
      },
      (err) => {
      }
    );

    this.authService.countUsers().subscribe(
      async (resp) => {
        this.countUsers = resp;
      },
      (err) => {
      }
    );

    this.authService.countMeetings().subscribe(
      async (resp) => {
        this.countMeetings = resp;
      },
      (err) => {
      }
    );

  }



}
