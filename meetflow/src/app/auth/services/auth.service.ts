import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;

  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

 
  constructor(private http: HttpClient) {
    
   
  }
/*   headers2 = new Headers(); */

  headers2 = new HttpHeaders({"Authorization": "Bearer " + localStorage.getItem('token'), "Content-Type": "application/json", "Accept": "*/*", "Connection": "keep-alive"});

  registro(name: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/signup`;
    const body = { email, password, name };

    return this.http.post(url, body);
  }

  userLogin(): Observable<any> {
    const url = `${this.baseUrl}/user/userLogin`;
    return this.http.get(url, {headers: this.headers2 });
  }


  login(username: string, password: string) {
    const url = `${this.baseUrl}/auth/signin`;
    const body = { username, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok === true) {
          localStorage.setItem('token', resp.token!);
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!,
          };
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  login2(email: string, password: string): Observable<any> {
    const url2 = `${this.baseUrl}/auth/signin`;
    
    const httpParams = {
      email: email,
      password: password,
    };

    let HttpOptions = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    HttpOptions.append("Content-Type", "application/json");
/*     this.headers2.append("Content-Type", "application/json");
    this.headers2.append("Authorization", "Bearer "+ localStorage.getItem("token")); */
    console.log("HEADERS =", this.headers2);
    return this.http.post<any>(url2, httpParams, {headers: this.headers2 });
  }

  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        console.log(resp.token);

        localStorage.setItem('token', resp.token!);
        this._usuario = {
          name: resp.name!,
          uid: resp.uid!,
          email: resp.email,
        };

        return true;
      }),
      catchError((err) => of(false))
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  listProjects(): Observable<any> {
    const url = `${this.baseUrl}/project/get/findByUser`;
    return this.http.get(url, {headers: this.headers2 });
  }

  addProject(namep: string, descriptionp: string): Observable<any> {
    const params = {
      name: namep,
      description: descriptionp,
      projectDate: '2029-05-08',
    };
    const url = `${this.baseUrl}/project/create`;
    return this.http.post(url, params, {headers: this.headers2 });
  }

  meeting(ide: string): Observable<any> {
    const params = { id: ide };
    const url = `${this.baseUrl}/meeting/project/` + ide;
    return this.http.get(url, {headers: this.headers2 });
  }

  addMeeting(idProject: string, numberMeetings: number): Observable<any> {
    const params = {
      name: 'Reunión ' + numberMeetings,
      description: 'descripcion reunion ' + numberMeetings,
      number: numberMeetings,
      project: idProject,
    };
    console.log(params);
    const url = `${this.baseUrl}/meeting`;
    return this.http.post(url, params, {headers: this.headers2 });
  }

  projectById(ide: string) {
    const url = `${this.baseUrl}/project/` + ide;
    return this.http.get(url, {headers: this.headers2 });
  }

  borrarProject(ide: string): Observable<any> {
    const url = `${this.baseUrl}/project/` + ide;
    return this.http.delete(url, {headers: this.headers2 });
  }
}
