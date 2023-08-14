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

  constructor(private http: HttpClient) { }
  /*   headers2 = new Headers(); */

  headers2 = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
    Accept: '*/*',
    Connection: 'keep-alive',
  });

  registro(name: string, tagName: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/signup`;
    const body = { email, tagName, password, name };

    return this.http.post(url, body);
  }

  userLogin(): Observable<any> {
    const url = `${this.baseUrl}/user/userLogin`;
    return this.http.get(url, { headers: this.headers2 });
  }

  login(username: string, password: string) {
    const url = `${this.baseUrl}/auth/signin`;
    const body = { username, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp: any) => {
        if (resp.ok === true) {
          localStorage.setItem('token', resp.token!);
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!,
          };
        }
      }),
      map((resp: any) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  login2(email: string, password: string): Observable<any> {
    const url2 = `${this.baseUrl}/auth/signin`;

    const httpParams = {
      email: email,
      password: password,
    };

    let HttpOptions = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    HttpOptions.append('Content-Type', 'application/json');
    /*     this.headers2.append("Content-Type", "application/json");
    this.headers2.append("Authorization", "Bearer "+ localStorage.getItem("token")); */
    /*   console.log('HEADERS =', this.headers2); */
    return this.http.post<any>(url2, httpParams, { headers: this.headers2 });
  }

  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp: any) => {
        /*    console.log(resp.token); */

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
    return this.http.get(url, { headers: this.headers2 });
  }

  addProject(namep: string, descriptionp: string): Observable<any> {
    const fecha = new Date().toDateString;

    const params = {
      shortName: namep,
      name: namep,
      description: descriptionp,
      projectDateI: new Date().toLocaleDateString(),
      projectDateT: new Date().toLocaleDateString(),
    };
    const url = `${this.baseUrl}/project/create`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  saveProject(
    nameShort: string,
    namep: string,
    descriptionp: string,
    fechaI: string,
    fechaT: string,
    idProject: string,
    userOwner: any,
    userMembers: any
  ): Observable<any> {
    if (fechaI === '') {
      if (fechaT === '') {
        const params = {
          shortName: nameShort,
          name: namep,
          description: descriptionp,
          userOwner,
          userMembers
        };
        const url = `${this.baseUrl}/project/` + idProject;
        return this.http.put(url, params, { headers: this.headers2 });
      } else {
        const params = {
          shortName: nameShort,
          name: namep,
          description: descriptionp,
          projectDateT: fechaT,
          userOwner,
          userMembers
        };
        const url = `${this.baseUrl}/project/` + idProject;
        return this.http.put(url, params, { headers: this.headers2 });
      }
    } else {
      if (fechaT === '') {
        const params = {
          shortName: nameShort,
          name: namep,
          description: descriptionp,
          projectDateI: fechaI,
          userOwner,
          userMembers
        };
        const url = `${this.baseUrl}/project/` + idProject;
        return this.http.put(url, params, { headers: this.headers2 });
      } else {
        const params = {
          shortName: nameShort,
          name: namep,
          description: descriptionp,
          projectDateI: fechaI,
          projectDateT: fechaT,
          userOwner,
          userMembers
        };
        const url = `${this.baseUrl}/project/` + idProject;
        return this.http.put(url, params, { headers: this.headers2 });
      }
    }
  }


  saveRemember(user: any,
    nameType: string,
    conditionTime: string,
    restaTimes: number): Observable<any> {
    const params = {
      name: user.name,
      email: user.email,
      type: nameType,
      time: conditionTime,
      remember: true,
      milisec: restaTimes,
    };
    console.log("ESTO ES LO QUE ESTAMOS ENVIANDO AL BACKEND PARA EL REMEMBER: ", params);
    const url = `${this.baseUrl}/reminder/create`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  saveRemember2(user: any,
    nameType: string,
    conditionTime: string,
    restaTimes: number): Observable<any> {
    const params = {
      name: user.name,
      email: user.email,
      type: nameType,
      time: conditionTime,
      remember: true,
      milisec: restaTimes,
    };
    console.log("ESTO SI ES EL REMEMBER: ", params);
    const url = `${this.baseUrl}/meeting-minute/notificary/remember/task`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  getRemembers(emailUser: string): Observable<any> {
    const params = {
      participants: emailUser,
    };
    const url = `${this.baseUrl}/reminder/` + emailUser;
    return this.http.get(url, { headers: this.headers2 });
  }

  meeting(ide: string): Observable<any> {
    const params = { id: ide };
    const url = `${this.baseUrl}/meeting/project/` + ide;
    return this.http.get(url, { headers: this.headers2 });
  }

  addMeeting(idProject: string, numberMeetings: number): Observable<any> {
    const params = {
      name: 'Reunión ' + numberMeetings,
      description: 'descripcion reunion ' + numberMeetings,
      number: numberMeetings,
      state: 'new',
      project: idProject,
    };
    /*   console.log(params); */
    const url = `${this.baseUrl}/meeting`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  addPreMeeting(idMeeting: string): Observable<any> {
    const params = {
      meeting: idMeeting,
      meetingMinute: null,
    };
    /*     console.log(params); */
    const url = `${this.baseUrl}/pre-meeting/` + idMeeting;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  addInMeeting(idMeeting: string): Observable<any> {
    const params = {
      meeting: idMeeting,
      meetingMinute: null,
    };
    /*   console.log(params); */
    const url = `${this.baseUrl}/in-meeting/` + idMeeting;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  projectById(ide: string) {
    const url = `${this.baseUrl}/project/` + ide;
    return this.http.get(url, { headers: this.headers2 });
  }

  borrarProject(ide: string): Observable<any> {
    const url = `${this.baseUrl}/project/` + ide;
    return this.http.delete(url, { headers: this.headers2 });
  }

  stateMeeting(idMeeting: string) {
    const url = `${this.baseUrl}/meeting/` + idMeeting;
    return this.http.get(url);
  }

  setStateMeeting(state: string, id: string) {
    const url = `${this.baseUrl}/meeting/edit/` + id + '/state';
    /*     console.log('ESTADO: ', state); */
    return this.http.post(url, { state });
  }

  addMeetingMinute(
    idMeeting: string,
    name: string,
    place: string,
    topics: string,
    number: number
  ): Observable<any> {
    const params = {
      title: name,
      place: place,
      startTime: new Date().toLocaleDateString(),
      endTime: new Date().toLocaleDateString(),
      startHour: '00:00',
      endHour: '00:00',
      meeting: idMeeting,
      number: number,
    };
    /*     console.log('PARAMETROS desde addMeetingMinute() es para crear desde 0 y no guardar', params); */
    const url = `${this.baseUrl}/meeting-minute`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  saveMeetingMinute(
    idMeeting: string,
    idMeetingMinute: string,
    name: string,
    place: string,
    fechaI: string,
    fechaT: string,
    startHour: string,
    endHour: string,
    topics: any,
    participants: any,
    secretaries: any,
    leaders: any,
    links: any,
    realStartTime: any,
    realEndTime: any
  ): Observable<any> {

    /* if (fechaI === '') {
      if (fechaT === '') {
        const params = {
          title: name,
          place: place,
          startTime: fechaI,
          endTime: fechaT,
          topics: topics,
          participants: participants,
          meeting: idMeeting,
          secretaries: secretaries,
        };
        const url = `${this.baseUrl}/meeting-minute/` + idMeetingMinute;
        return this.http.put(url, params, { headers: this.headers2 });
      } else {
        const params = {
          title: name,
          place: place,
          startTime: fechaI,
          endTime: fechaT,
          topics: topics,
          participants: participants,
          meeting: idMeeting,
          secretaries: secretaries,
        };
        const url = `${this.baseUrl}/meeting-minute/` + idMeetingMinute;
        return this.http.put(url, params, { headers: this.headers2 });
      }
    } else {
      if (fechaT === '') {
        const params = {
          title: name,
          place: place,
          startTime: fechaI,
          endTime: fechaT,
          topics: topics,
          participants: participants,
          meeting: idMeeting,
          secretaries: secretaries,
        };
        const url = `${this.baseUrl}/meeting-minute/` + idMeetingMinute;
    return this.http.put(url, params, { headers: this.headers2 });
      } else {
        const params = {
          title: name,
          place: place,
          startTime: fechaI,
          endTime: fechaT,
          topics: topics,
          participants: participants,
          meeting: idMeeting,
          secretaries: secretaries,
        };
        const url = `${this.baseUrl}/meeting-minute/` + idMeetingMinute;
        return this.http.put(url, params, { headers: this.headers2 });
      }
    } */

    const params = {
      title: name,
      place: place,
      startTime: fechaI,
      endTime: fechaT,
      startHour: startHour,
      endHour: endHour,
      topics: topics,
      participants: participants,
      meeting: idMeeting,
      secretaries: secretaries,
      leaders: leaders,
      links: links,
      realStartTime: realStartTime,
      realEndTime: realEndTime

    };

    /*  console.log('PARAMETROS', params);
     console.log('ID DE ACTA: ', idMeetingMinute); */
    const url = `${this.baseUrl}/meeting-minute/` + idMeetingMinute;
    return this.http.put(url, params, { headers: this.headers2 });
  }

  getMeetingMinute(meetingSelectedId: any): Observable<any> {

    /*     console.log("EL IDE QUEE ESTA LLEGANDO AL SERVICIO: ", meetingSelectedId) */
    const params = {
      meeting: meetingSelectedId,
    };

    /*   console.log("VAMOS A BUSCAR SI TENEMOS UN ACTA DIALOGICA CON LA REUNION SELECCIONADA CON EL ID: ",meetingSelectedId ) */
    const url = `${this.baseUrl}/meeting-minute/` + meetingSelectedId;
    return this.http.get(url, { headers: this.headers2 });
  }

  getUserProfile(userId: string): Observable<any> {
    const params = {
      user: userId,
    };
    const url = `${this.baseUrl}/user/perfil/` + userId;
    return this.http.get(url, { headers: this.headers2 });
  }

  getUserByEmail(userEmail: string): Observable<any> {
    const params = {
      email: userEmail,
    };
    const url = `${this.baseUrl}/user/perfil/email/` + userEmail;
    return this.http.get(url, { headers: this.headers2 });
  }

  saveUserProfile(
    name: string,
    tagName: string,
    institution: string,
    idUser: string,
    email: string,
    password: string
  ) {
    const params = {
      name: name,
      tagName: tagName,
      institution: institution,
      email: email,
      password: password,
    };

    /*  console.log('PARAMETROS', params); */
    const url = `${this.baseUrl}/user/update/` + idUser;
    return this.http.put(url, params, { headers: this.headers2 });
  }

  saveProjectCurrent(idUser: string, user: any) {
    const params = {
      name: user.name,
      institution: user.institution,
      email: user.email,
      password: user.password,
      currentProject: user.currentProject,
      currentMeeting: user.currentMeeting,
      lastLink: user.lastLink,
      currentProjectId: user.currentProjectId,
      currentMeetingId: user.currentMeetingId

    };

    /* console.log('PARAMETRITOS: ', params); */
    const url = `${this.baseUrl}/user/update/` + idUser;
    return this.http.put(url, params, { headers: this.headers2 });


  }


  setStateElement(idElement: string, state: string) {

    const params = {
      state: state
    };

    const url = `${this.baseUrl}/element/update/` + idElement;
    return this.http.put(url, params, { headers: this.headers2 });


  }

  saveUserColor(idUser: string, color: string) {
    const params = {
      color: color,
      password: 'errorcapa9'
    };
    /*     console.log("[SERVICIO] COLOR QUE RECIBO: ", color) */

    /* console.log('PARAMETRITOS: ', params); */
    const url = `${this.baseUrl}/user/update/` + idUser;
    return this.http.put(url, params, { headers: this.headers2 });


  }




  addMember(emailMember: string, idProject: string): Observable<any> {
    const params = {
      meeting: emailMember,
    };
    const url =
      `${this.baseUrl}/project/` + idProject + '/member/' + emailMember;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  addCompromise(
    desc: string,
    idTopic: number,
    meetingSelectedId: string,
    type: string,
    projectSelectedId: string,
    numberMeet: number,
    participants: any,
    dateLimit: any
  ): Observable<any> {
    const params = {
      description: desc,
      type: type,
      topic: idTopic,
      meeting: meetingSelectedId,
      project: projectSelectedId,
      state: 'new',
      number: numberMeet,
      participants,
      dateLimit
    };
    const url = `${this.baseUrl}/element/`;
    return this.http.post(url, params, { headers: this.headers2 });
  }


  updateElement(
    desc: string,
    idTopic: number,
    meetingSelectedId: string,
    type: string,
    projectSelectedId: string,
    numberMeet: number,
    participants: any,
    dateLimit: any,
    id: string) {
    const params = {
      description: desc,
      type: type,
      topic: idTopic,
      meeting: meetingSelectedId,
      project: projectSelectedId,
      state: 'new',
      number: numberMeet,
      participants,
      dateLimit
    };
    console.log("ELEMENTO ACTUALIZANDOSE");
    const url = `${this.baseUrl}/element/update/` + id;
    return this.http.put(url, params, { headers: this.headers2 });

  }

  getCompromises(meetingSelectedId: string): Observable<any> {
    const params = {
      meeting: meetingSelectedId,
    };
    const url = `${this.baseUrl}/element/meeting/` + meetingSelectedId;
    return this.http.get(url, { headers: this.headers2 });
  }

  getCompromisesPreview(projectSelectedId: string): Observable<any> {
    const params = {
      projectId: projectSelectedId,
    };
    const url = `${this.baseUrl}/element/project/preview/` + projectSelectedId;
    return this.http.get(url, { headers: this.headers2 });
  }
  getCompromisesProyect(projectSelectedId: string): Observable<any> {
    const params = {
      projectId: projectSelectedId,
    };
    const url = `${this.baseUrl}/element/project/` + projectSelectedId;
    return this.http.get(url, { headers: this.headers2 });
  }

  getCompromisesUser(emailUser: string): Observable<any> {
    const params = {
      participants: emailUser,
    };
    const url = `${this.baseUrl}/element/participants/` + emailUser;
    return this.http.get(url, { headers: this.headers2 });
  }

  addResponsible(user: string, idElement: string): Observable<any> {
    const params = {
      _id: idElement,
      participants: user,
    };

    const url = `${this.baseUrl}/element/update/` + idElement;
    return this.http.put(url, params, { headers: this.headers2 });
  }

  addDateLimit(dateLimit: string, idElement: string): Observable<any> {
    const params = {
      _id: idElement,
      dateLimit: dateLimit,
    };

    const url = `${this.baseUrl}/element/update/` + idElement;
    return this.http.put(url, params, { headers: this.headers2 });
  }

  notifyParticipants(meetingMinute: any, meetingId: any, state: string, linky: string) {
    const params = {
      title: meetingMinute.name,
      place: meetingMinute.place,
      startTime: meetingMinute.fechaI,
      endTime: meetingMinute.fechaT,
      topics: meetingMinute.topics,
      participants: meetingMinute.participants,
      meeting: 'hola',
      secretaries: meetingMinute.secretaries,
      number: meetingMinute.number,
      fase: state,
      linky: linky

    };
    console.log("[ SERVICIO] LO que envio como minuta para notificar es: ", params)

    const url = `${this.baseUrl}/meeting-minute/notificar`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  muestraKanban(){
    const params = {
      title: '',

    };

    const url = `${this.baseUrl}/kanban/ver/kanban`;

    return this.http.get(url, { headers: this.headers2 });

    
  }

  muestraTare(){
    const params = {
      title: '',

    };
    const url = `${this.baseUrl}/task/ver/tarea`;
    return this.http.get(url, { headers: this.headers2 });

  }





  
}
