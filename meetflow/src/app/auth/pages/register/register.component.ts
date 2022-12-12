import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    name: ['nuevousuario', [Validators.required]],
    email: ['nuevousuario@gmail.com', [Validators.required, Validators.email]],
    password: ['123', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  register() {
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);
    //this.router.navigateByUrl('/dashboard');

    const { email, password, name } = this.miFormulario.value;
    this.authService.registro(name, email, password).subscribe((resp) => {
      console.log(resp.active);
      if (resp.active === false) {
        /* this.router.navigateByUrl('/main'); */
        Swal.fire({
          title: 'Input email address',
          icon: 'success'
        
        });
      } else {
        this.router.navigateByUrl('/login'); 
        Swal.fire({
          title: 'Registrado',
          icon: 'success'
        
        });
        /* Swal.fire('Error', resp.active, 'error'); */
      }
    });
  }
}
