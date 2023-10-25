import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  $emitter = new EventEmitter();

  emitirEvento() {
    this.$emitter.emit();
}   
  
  private baseUrl: string = environment.baseUrl;

  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

  allUsers() {

  }

  constructor(private http: HttpClient) { }

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

  /* 
  Metodo de ingresar al usuario a la plataforma
  Entrada: correo electronico y constraseña
  Salida: Consulta al end-point "/auth/signin" de API-Gateway 
  */
  login(email: string, password: string): Observable<any> {
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

  createTasks(meetingId: string): Observable<any> {
    const params = {
      meetingId: meetingId,
    };
    console.log("[TASKS SERVICE ] recibimos este id de reunion para crear tareas: ", params);
    const url = `${this.baseUrl}/task/createTasksForCompromises/meeting/` + meetingId;
    return this.http.post(url, params, { headers: this.headers2 });
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
  saveRemember3(user: any,
    nameType: string,
    conditionTime: string,
    restaTimes: number,
    compromiso: any): Observable<any> {
    const params = {
      name: user.name,
      email: user.email,
      oncharge: compromiso.participants,
      type: nameType,
      time: conditionTime,
      remember: true,
      milisec: restaTimes,
    };
    console.log("ESTO ES LO QUE ESTAMOS ENVIANDO AL BACKEND PARA EL REMEMBER: ", params);
    const url = `${this.baseUrl}/reminder/create`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  deleteRemember(idReminder: string): Observable<any> {
    const url = `${this.baseUrl}/reminder/` + idReminder;
    return this.http.delete(url, { headers: this.headers2 });
  }

  saveRemember2(
    user: any,
    nameType: string,
    conditionTime: string,
    restaTimes: number,
    oncharge: string): Observable<any> {
    const params = {
      name: user.name,
      email: user.email,
      type: nameType,
      time: conditionTime,
      remember: true,
      milisec: restaTimes,
      oncharge: oncharge
    };
    console.log("ESTO SI ES EL REMEMBER: ", params);
    const url = `${this.baseUrl}/meeting-minute/notify/reminder/task`;
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
    const url = `${this.baseUrl}/meeting`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  addPreMeeting(idMeeting: string): Observable<any> {
    const params = {
      meeting: idMeeting,
      meetingMinute: null,
    };
    const url = `${this.baseUrl}/pre-meeting/` + idMeeting;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  addInMeeting(idMeeting: string): Observable<any> {
    const params = {
      meeting: idMeeting,
      meetingMinute: null,
    };
    const url = `${this.baseUrl}/in-meeting/` + idMeeting;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  projectById(ide: string) {
    console.log("[SERVICE] ESTAMOS CONSULTADO POR EL PROYECTO: ", ide);
    const url = `${this.baseUrl}/project/getProjectbyID/` + ide;
    return this.http.get(url, { headers: this.headers2 });
  }

  getAllUser() {
    const url = `${this.baseUrl}/user/get/allUser`;
    return this.http.get(url, { headers: this.headers2 });
  }

  deleteUser(idUser: string) {
    const url = `${this.baseUrl}/user/` + idUser;
    return this.http.delete(url, { headers: this.headers2 });
  }

  borrarProject(ide: string): Observable<any> {
    const url = `${this.baseUrl}/project/` + ide;
    return this.http.delete(url, { headers: this.headers2 });
  }

  borrarMeet(ide: string): Observable<any> {
    const url = `${this.baseUrl}/meeting/` + ide;
    return this.http.delete(url, { headers: this.headers2 });
  }


  stateMeeting(idMeeting: string) {
    const url = `${this.baseUrl}/meeting/` + idMeeting;
    return this.http.get(url);
  }

  setStateMeeting(state: string, id: string) {
    const url = `${this.baseUrl}/meeting/edit/` + id + '/state';
    return this.http.post(url, { state });
  }

  addMeetingMinute(
    idMeeting: string,
    name: string,
    place: string,
    topics: string,
    number: number
  ): Observable<any> {

    let fecha = new Date().toLocaleDateString();
    if(fecha.split("-").length > 1){
      let startTime = fecha.split('-')[1] + '-' + fecha.split('-')[0] + '-' + fecha.split('-')[2] ;
      const params = {
        title: name,
        place: place,
        startTime: startTime,
        endTime: new Date().toLocaleDateString(),
        startHour: '00:00',
        endHour: '00:00',
        meeting: idMeeting,
        number: number,
      };
      const url = `${this.baseUrl}/meeting-minute`;
      return this.http.post(url, params, { headers: this.headers2 });
    }else{
   
      let startTime = fecha.split('/')[0] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[2] ;
      let startTime2 = startTime.split('-')[0] + '-' + startTime.split('-')[1] + '-' + startTime.split('-')[2] ;
      const params = {
        title: name,
        place: place,
        startTime: startTime2,
        endTime: new Date().toLocaleDateString(),
        startHour: '00:00',
        endHour: '00:00',
        meeting: idMeeting,
        number: number,
      };
      const url = `${this.baseUrl}/meeting-minute`;
      return this.http.post(url, params, { headers: this.headers2 });
    }
   
  }

  addMeetingMinuteLastConfig(
    idMeeting: string,
    name: string,
    place: string,
    topics: string,
    number: number,
    secretaries: any,
    hosters: any,
    participants: any
  ): Observable<any> {
    
    let fecha = new Date().toLocaleDateString();
    if(fecha.split("/").length === 0){
      let startTime = fecha.split('-')[0] + '-' + fecha.split('-')[1] + '-' + fecha.split('-')[2] ;
     
      const params = {
        title: name,
        place: place,
        startTime: startTime,
        endTime: new Date().toLocaleDateString(),
        startHour: '00:00',
        endHour: '00:00',
        meeting: idMeeting,
        number: number,
        secretaries: secretaries,
        leaders: hosters,
        participants: participants
      };
      const url = `${this.baseUrl}/meeting-minute`;
      return this.http.post(url, params, { headers: this.headers2 });
    }
    else{
      let startTime = fecha.split('/')[0] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[2] ;
      let startTime2 = startTime.split('-')[0] + '-' + startTime.split('-')[1] + '-' + startTime.split('-')[2] ;
      const params = {
        title: name,
        place: place,
        startTime: startTime2,
        endTime: new Date().toLocaleDateString(),
        startHour: '00:00',
        endHour: '00:00',
        meeting: idMeeting,
        number: number,
        secretaries: secretaries,
        leaders: hosters,
        participants: participants
      };
      const url = `${this.baseUrl}/meeting-minute`;
      return this.http.post(url, params, { headers: this.headers2 });
    }
    
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
    realEndTime: any,
    assistants: any,
    externals: any
  ): Observable<any> {
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
      realEndTime: realEndTime,
      assistants: assistants,
      externals: externals

    };
    const url = `${this.baseUrl}/meeting-minute/` + idMeetingMinute;
    return this.http.put(url, params, { headers: this.headers2 });
  }

  getMeetingMinute(meetingSelectedId: any): Observable<any> {
    const params = {
      meeting: meetingSelectedId,
    };

    const url = `${this.baseUrl}/meeting-minute/` + meetingSelectedId;
    return this.http.get(url, { headers: this.headers2 });
  }

  getMeetByProjectNumber(projectSelectedId: string, numberMeet: number): Observable<any> {
    const params = {
      idProject: projectSelectedId,
    };
    const url = `${this.baseUrl}/meeting/project/` + projectSelectedId + '/number/' + numberMeet;
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
    const url = `${this.baseUrl}/user/update/` + idUser + '/profile';
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
    const url = `${this.baseUrl}/user/update/` + idUser + '/section';
    return this.http.put(url, params, { headers: this.headers2 });
  }

  saveProjectCurrent2(idUser: string, user: any) {
    const params = {
      name: user.name,
      institution: user.institution,
      email: user.email,
      password: ' ',
      currentProject: user.currentProject,
      currentMeeting: user.currentMeeting,
      lastLink: user.lastLink,
      currentProjectId: user.currentProjectId,
      currentMeetingId: user.currentMeetingId
    };
    const url = `${this.baseUrl}/user/update/` + idUser + '/section';
    return this.http.put(url, params, { headers: this.headers2 });
  }

  saveProjectCurrent3(idUser: string, user: any) {
    const params = {
      name: user.name,
      institution: user.institution,
      email: user.email,
      password: ' ',
      currentProject: user.currentProject,
      currentMeeting: user.currentMeeting,
      lastLink: "/main/remember",
      currentProjectId: user.currentProjectId,
      currentMeetingId: user.currentMeetingId
    };
    const url = `${this.baseUrl}/user/update/` + idUser + '/section';
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
      password: ' '
    };
    const url = `${this.baseUrl}/user/update/` + idUser + '/color';
    return this.http.put(url, params, { headers: this.headers2 });
  }


  addMember(emailMember: string, idProject: string): Observable<any> {
    const params = {
      meeting: emailMember,
    };
    const url =
      `${this.baseUrl}/project/` + idProject + '/add/member/' + emailMember;
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
    id: any,
    position: any,
    isSort: any) {
    const params = {
      description: desc,
      type: type,
      topic: idTopic,
      meeting: meetingSelectedId,
      project: projectSelectedId,
      state: 'new',
      number: numberMeet,
      participants,
      dateLimit,
      position,
      isSort: isSort
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

  getTasksByProject(emailUser: string, idProject: string, state: string): Observable<any> {
    const params = {
      participants: emailUser,
    };
    const url = `${this.baseUrl}/element/project/` + idProject + '/user/' + emailUser + '/state/' + state;
    return this.http.get(url, { headers: this.headers2 });
  }

  getTasksByUserProject(emailUser: string, idProject: string): Observable<any> {
    const params = {
      participants: emailUser,
    };
    const url = `${this.baseUrl}/element/project/` + idProject + '/user/' + emailUser;
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
      leaders: meetingMinute.leaders,
      number: meetingMinute.number,
      fase: state,
      linky: linky

    };
    console.log("[ SERVICIO] LO que envio como minuta para notificar es: ", params)

    const url = `${this.baseUrl}/meeting-minute/notify/state/change`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  notifyExternal(meetingMinute: any, meetingId: any, state: string, linky: string, emailExternal: string) {
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
      linky: linky,
      emailExternal: emailExternal
    };
    const url = `${this.baseUrl}/meeting-minute/notify/user/external'`;
    return this.http.post(url, params, { headers: this.headers2 });
  }

  muestraKanban() {
    const params = {
      title: '',

    };

    const url = `${this.baseUrl}/kanban/ver/kanban`;

    return this.http.get(url, { headers: this.headers2 });


  }

  muestraTare() {
    const params = {
      title: '',

    };
    const url = `${this.baseUrl}/task/ver/tarea`;
    return this.http.get(url, { headers: this.headers2 });

  }

  resetPass(email: string) {
    console.log("[SERVICE AUTH: RESET_PASS] email:", email);
    const url = `${this.baseUrl}/auth/resetpass/` + email;
    return this.http.get(url, { headers: this.headers2 });
  }

  deleteElement(idElement: string) {
    const url = `${this.baseUrl}/element/` + idElement;
    return this.http.delete(url, { headers: this.headers2 });
  }



  countUsers(): Observable<any> {
    const url = `${this.baseUrl}/user/counts`;
    return this.http.get(url, { headers: this.headers2 });
  }


  countMeetings(): Observable<any> {
    const url = `${this.baseUrl}/meeting/counts`;
    return this.http.get(url, { headers: this.headers2 });
  }



}
