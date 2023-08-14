import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  user: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.userLogin().subscribe(
      async (resp) => {
        console.log('[USER] CUAL ES EL USUARIO?', resp);
        this.user = resp;
        this.getUserProfile(this.user.id);
      },
      (err) => {
        Swal.fire('Error', err.error.message, 'error');
      }
    );
  }
  userEditForm!: FormGroup;
  userSelected: any;
  maxLength = 3;
  isEditable=false;
  characterCount = 0;

  ngOnInit(): void {
    this.userEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      tagName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      institution: ['', [Validators.required, Validators.minLength(0)]],
      email: ['', [Validators.required, Validators.minLength(6)]],
     /*  password: ['', [Validators.required, Validators.minLength(6)]], */
    });
   
  }


  changePassword(){

    Swal.fire({
      title: 'Cambio de contraseña',
      text: 'Ingresar nueva contraseña',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Actualizar contraseña',

      showLoaderOnConfirm: true,
      showDenyButton: false,
      denyButtonText: `Añadir como Secretario`,
      preConfirm: (password) => {
        this.userSelected.password = password;

        this.saveUser();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        console.log('RESULTADO ROJO', result);
        /*    this.router.navigateByUrl('/main/add-project'); */
      }
    });

  }


  saveUser() {
    if (this.userEditForm.valid) {
      this.userEditForm.markAllAsTouched();
      let { name, tagName, institution, email } = this.userEditForm.value;

      console.log(name);
      console.log(institution);

      this.authService
        .saveUserProfile(name, tagName, institution, this.user.id, email, this.userSelected.password)
        .subscribe(
          async (resp) => {
            console.log('RESPUESTA', resp);
            /* this.router.navigateByUrl('/main/add-project'); */

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
              title: 'Se ha guardado el perfil exitosamente.'
            })
            setTimeout(() => {
              this.getUserProfile(this.user.id);
            }, 2000);
          },
          (err: { message: string | undefined }) => {}
        );
    }
    console.log('ES VALIDO EL FORMULARIO?', this.userEditForm.valid);
    if (!this.userEditForm.valid) {
      this.userEditForm.markAllAsTouched();
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Revisar los campos',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  editable(){
    this.isEditable = !this.isEditable ;
  }

  getUserProfile(userId: string) {
    /*     console.log('MEETING MINUTE', userId); */

    this.authService.getUserProfile(userId).subscribe(
      async (resp) => {
        console.log('[USER] TODO LO QUE SOY', resp);

        this.userSelected = resp;
       /*  this.userSelected.password = ''; */

        this.userEditForm.patchValue(this.userSelected);

        /* this.router.navigateByUrl('/main/add-project'); */

        /*         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Visualizando acta: ',
          showConfirmButton: false,
          timer: 2000,
        }); */
        /*     this.meetingMinuteForm.reset(); */
        setTimeout(() => {
          /*   this.getCompromisesPreviews(); */
          /*     location.reload(); */
        }, 2000);
      },
      (err: { message: string | undefined }) => {}
    );
  }

  campoEsValido(campo: string) {
    return (
      this.userEditForm.controls[campo].errors &&
      this.userEditForm.controls[campo].touched
    );
  }
}
