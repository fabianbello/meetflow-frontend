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

  constructor(private http: HttpClient) {}

  registro(name: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/signup`;
    const body = { email, password, name };

    return this.http.post(url, body);
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
    return this.http.post<any>(url2, httpParams);
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
    localStorage.setItem('accessToken', token);
  }

  listProjects(): Observable<any> {
    const url = `${this.baseUrl}/project`;
    return this.http.get(url);
  }

  addProject(namep: string, descriptionp: string): Observable<any> {
    const params = {
      name: namep,
      description: descriptionp,
      projectDate: '2029-05-08',
    };
    const url = `${this.baseUrl}/project`;
    return this.http.post(url, params);
  }

  meeting(ide: string): Observable<any> {
    const params = { id: ide };
    const url = `${this.baseUrl}/meeting/project/` + ide;
    return this.http.get(url);
  }

  addMeeting(
    idProject: string,
    numberMeetings: number,
  ): Observable<any> {
    const params = {
      name: 'Reunión ' + numberMeetings,
      description: 'descripcion reunion '+ numberMeetings ,
      number: numberMeetings,
      project: idProject,
    };
    console.log(params);
    const url = `${this.baseUrl}/meeting`;
    return this.http.post(url, params);
  }

  projectById(ide:string): Observable<any>{

    const url =  `${this.baseUrl}/project/` + ide;
    return this.http.get(url);
  }

  borrarProject(ide: string): Observable<any>{
    const url =  `${this.baseUrl}/project/` + ide;
    return this.http.delete(url);
  }
}
