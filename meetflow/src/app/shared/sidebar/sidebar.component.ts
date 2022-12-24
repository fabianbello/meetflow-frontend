import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/main', title: 'nombre 1 ',  icon: 'pe-7s-home', class: '' },
  { path: '/login', title: 'nombre 2',  icon: 'pe-7s-note2', class: '' },
  { path: '/main', title: 'nombre 3',  icon: 'pe-7s-plus', class: '' },
  { path: '/management/board', title: 'nombre 4',  icon: 'pe-7s-albums', class: '' },
  { path: '/list-reports', title: 'nombre 5',  icon: 'pe-7s-copy-file', class: '' },
  /* { path: '/observation', title: 'Observación',  icon: 'pe-7s-comment', class: '' }, */
  { path: '/stats', title: 'nombre 6',  icon: 'pe-7s-graph', class: '' },
  // { path: '/user', title: 'User Profile',  icon: 'pe-7s-user', class: '' },
  // { path: '/table', title: 'Table List',  icon: 'pe-7s-note2', class: '' },
  // { path: '/typography', title: 'Typography',  icon: 'pe-7s-news-paper', class: '' },
  // { path: '/icons', title: 'Icons',  icon: 'pe-7s-science', class: '' },
  // { path: '/notifications', title: 'Notifications',  icon: 'pe-7s-bell', class: '' },
  // { path: '/checking', title: 'Checking',  icon: 'pe-7s-note2', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})

export class SidebarComponent implements OnInit {
  
  menuItems: any[] = ROUTES;
  logged = false;
  process = false;
  projects: any;
  projectSelectedId: string = '';
  countMeetings: number=0;
  meetings: any;

  titles: string[] = ['#', 'Nombre', 'Apellido', 'Correo', 'Cargo', 'Teléfono', 'Acción'];

  miFormulario: FormGroup = this.fb.group({
    asd: ['proyect 2'],
  });

  persona = {
    asd: 'proyecto 3',
  };


  constructor( 
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder) {

    /*   this.listProjectsInicial();
      this.miFormulario.reset({ ...this.persona}); */

     /*  this.listMeetingsInicial("639add0a0292225f19c9c870"); */

     }

  ngOnInit(): void {

    
    
    /* const bsButton = new bootstrap.Button('#myButton') */
    this.menuItems = ROUTES
    this.listProjectsInicial();
   
    
  }

  listProjectsInicial(){
    this.authService.listProjects().subscribe(
      (resp: any[]) => {
        console.log(resp);
        
        this.projects = resp;

         
      },
      (err: any) => {
        console.log(err);
        this.projects = [];
      }
    );
  }

  listMeetingsInicial(id: string){
    this.authService.meeting(id).subscribe((resp: any) => {

      this.router.navigateByUrl('/main/edit-project');
      console.log(resp);


      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'reuniones correctas',
        showConfirmButton: false,
        timer: 1000
      })
    },
    (err: string | undefined) => {
      Swal.fire('Error', err, 'error');
    }
    
    );
  }

  async editProject(id: string){
    
    this.authService.meeting(id).subscribe(async (resp: any) => {

  const asd = await this.router.navigateByUrl('/main/loading'); 
      this.router.navigateByUrl('/main/' + id + '/edit-project');
      console.log(resp);

      this.meetings = resp;
      this.projectSelectedId = id;
      this.countMeetings = this.meetings.length;

      console.log(this.countMeetings);
    
     /*  Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'reuniones cargadas correctamente',
        showConfirmButton: false,
        timer: 1000
      }) */
    },
    (err: string | undefined) => {
      Swal.fire('Error', err, 'error');
    }
    
    );

  }

  editProject2(){

  }

  editMeeting(id: string){
    const url2= '/main/' +  this.projectSelectedId + '/meeting/' + id;
   /*  console.log(url2) */
  
    this.router.navigateByUrl(url2);

  }

  addMeeting(){
/*     const url2= '/main/' +  this.projectSelectedId + '/add-meeting';
    console.log(url2)
    this.router.navigateByUrl(url2); */

    
    this.authService.addMeeting(this.projectSelectedId, this.countMeetings ).subscribe((resp: any) => {

      console.log(resp);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Reunion creada correctamente',
        showConfirmButton: false,
        timer: 1000
      })


      this.authService.meeting(this.projectSelectedId).subscribe((resp: any) => {

        this.meetings = resp;
        this.countMeetings = this.meetings.length;
      
      /*   Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'reuniones cargadas correctamente',
          showConfirmButton: false,
          timer: 1000
        }) */
      },
      (err: string | undefined) => {
        Swal.fire('Error', err, 'error');
      }
      
      );

    },
    (err: string | undefined) => {
      Swal.fire('Error', err, 'error');
    }
    
    );


  }

  onScroll(){

  }

  agregarProjectNew(){
    Swal.fire({
      title: 'Creacion de proyecto',
      text: '¿Nombre del proyecto?',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'crear',
     
      showLoaderOnConfirm: true, 
      showDenyButton: true,
      denyButtonText: `Avanzado`,
      preConfirm: (nameProject) => {
        this.crearProject(nameProject);
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
  
        
      } else if (result.isDenied) {

        this.router.navigateByUrl('/main/add-project');
      }
    })
  }

  crearProject(nameProject: string){
    this.authService.addProject(nameProject, 'default').subscribe(
      (resp: any[]) => {
        console.log(resp);
        this.listProjectsInicial();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha creado el projecto: ',
          text: nameProject,
          showConfirmButton: false,
          timer: 2000,
        });


      },
      (err: any) => {
        console.log(err);
        Swal.fire('Error', err.message, 'error');
      }
    );
  }

}
