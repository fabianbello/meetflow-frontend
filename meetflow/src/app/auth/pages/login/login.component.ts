import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor( private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  login(){
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);

    /* this.authService.validarToken()
    .subscribe(resp=> console.log(resp)); */

    const {email, password}  = this.miFormulario.value;
    this.authService.login(email, password).subscribe(resp => {
      console.log(resp);
      if(resp === true){
        this.router.navigateByUrl('/main');
      } else {
        Swal.fire('Error', resp, 'error');
      }
    })

    /* this.router.navigateByUrl('/dashboard'); */
  }

}
