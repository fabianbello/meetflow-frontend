import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent {
  miFormulario: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(6)]],
  });

  idProyect: any = ' ';

  projectSelected: any = {
    name: '',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {

    this.idProyect = this.route.snapshot.paramMap.get('id');

    this.authService.projectById(this.idProyect).subscribe(
      async (resp) => {
        console.log(resp);
        this.projectSelected = resp;
        /* this.router.navigateByUrl('/main/add-project'); */


        setTimeout(() => {
          
       /*  Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'informacion del proyecto: ',
          text: resp.name,
          showConfirmButton: false,
          timer: 1000,
        }); */
        }, 1000);
      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );
    

  }

  
  addProject() {
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);

    /* this.authService.validarToken()
    .subscribe(resp=> console.log(resp)); */

    const { name, description } = this.miFormulario.value;
    console.log(name);
    console.log(description);
    this.authService.addProject(name, description).subscribe(
      async (resp) => {
        console.log(resp);
        /* this.router.navigateByUrl('/main/add-project'); */
        this.projectSelected = resp;
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha creado el projecto: ',
          text: resp.name,
          showConfirmButton: false,
          timer: 2000,
        });
        this.miFormulario.reset();
        setTimeout(() => {
          location.reload();
        }, 2000);
      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );

    /* this.router.navigateByUrl('/dashboard'); */
  }

  borrarP(id: string){
    this.authService.borrarProject(id).subscribe(
      async (resp) => {
        console.log(resp);
        /* this.router.navigateByUrl('/main/add-project'); */
    
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha borrado el projecto: ',
          text: resp.name,
          showConfirmButton: false,
          timer: 2000,
        });
        this.miFormulario.reset();
        setTimeout(() => {
          this.router.navigateByUrl('/main'); 
        }, 2000);
        setTimeout(() => {
          location.reload()
        }, 2000);
       
      },
      (err: { message: string | undefined }) => {
        Swal.fire('Error', err.message, 'error');
      }
    );

  }
}
