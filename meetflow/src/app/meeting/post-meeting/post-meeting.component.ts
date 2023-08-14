import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-meeting',
  templateUrl: './post-meeting.component.html',
  styleUrls: ['./post-meeting.component.css']
})
export class PostMeetingComponent {
  isMeetingMinute: boolean = true;

  constructor(private router: Router,) { }

  pomg() {
    if (this.isMeetingMinute) {
      this.isMeetingMinute = false;
    }
    else {
      this.isMeetingMinute = true;
    }
  }

}
