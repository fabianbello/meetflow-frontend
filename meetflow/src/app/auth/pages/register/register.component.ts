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
    name: ['Juan', [Validators.required]],
    email: ['juanperez@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
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
      this.router.navigateByUrl('/auth/signin');
      console.log(resp);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Registrado con exito',
        showConfirmButton: false,
        timer: 1000
      })
    },
    (err) => {
      Swal.fire('Error', err, 'error');
    }
    
    );
  }
}
