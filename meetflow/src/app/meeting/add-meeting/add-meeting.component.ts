import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css']
})
export class AddMeetingComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(6)]],
  });

  idProyecto: any = ' ';
  id: any = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {

    
  }

  ngOnInit(): void {
    this.idProyecto = this.route.snapshot.paramMap.get('id');
   
  }

  addMeeting() {
    /* console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);

    this.authService.validarToken()
    .subscribe(resp=> console.log(resp));

    const { name, description } = this.miFormulario.value;
    console.log(name);
    console.log(description);
    this.authService.addMeeting(this.idProyecto, name, description).subscribe(
      async (resp) => {
        console.log(resp);
        this.router.navigateByUrl('/main/add-project');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha creado la reunion: ',
          text: resp.name,
          showConfirmButton: false,
          timer: 2000
        });
        this.miFormulario.reset();
        setTimeout(()=> {this.router.navigate(['/main/']); }, 2000);
    
      },
      (err: { message: string | undefined; }) => {
        Swal.fire('Error', err.message, 'error');
      }
    ); */

    /* this.router.navigateByUrl('/dashboard'); */
  }


}
