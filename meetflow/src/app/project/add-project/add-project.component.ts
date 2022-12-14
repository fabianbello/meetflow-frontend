import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {

  miFormulario: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  login() {
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);

    /* this.authService.validarToken()
    .subscribe(resp=> console.log(resp)); */

    const { name, description } = this.miFormulario.value;
    console.log(name);
    console.log(description);
    this.authService.addProject(name, description).subscribe(
      (resp) => {
        console.log(resp);
        this.miFormulario.reset();
        /* this.router.navigateByUrl('/main/add-project'); */
        location.reload();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Ingresado con exito',
          showConfirmButton: false,
          timer: 1000
        })
      },
      (err) => {
        Swal.fire('Error', err.message, 'error');
      }
    );

    /* this.router.navigateByUrl('/dashboard'); */
  }

}