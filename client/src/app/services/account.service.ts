import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { AuthUrlDTO } from '../dtos/AuthUrlDTO';
import { RegisterDTO } from '../models/registerDTO';
import { RegisterOauthDTO } from '../models/registerOauthDTO';
import { Elev } from '../models/elev';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(model: any)
  {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: IUser) => {
        const user = response;
        if(user)
        {
          const roles = this.getDecodedToken(user.token).role;
          user.roles = [];
          Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
          localStorage.setItem('userApplication', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  registerCont(registerDto: RegisterDTO){

      return this.http.post<any>(this.baseUrl + 'account/register',
      {DisplayName: registerDto.displayName,
      Email: registerDto.email,
      Password: registerDto.parola,
      NumarDeTelefon: registerDto.numarDeTelefon,
      Nivel: registerDto.nivel,
      Varsta: registerDto.varsta,
      TermeniSiConditii: registerDto.termeniSiConditii});
    }

  createOauthGoogleAccount(registerDto: RegisterOauthDTO){
    return this.http.post<any>(this.baseUrl + 'account/oauthregister',
    {DisplayName: registerDto.displayName,
    Email: registerDto.email,
    LocatieNumar: registerDto.locatieNumar}).pipe(
      map((response: IUser) => {
        const user = response;
        if(user)
        {
          const roles = this.getDecodedToken(user.token).role;
          user.roles = [];
          Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
          localStorage.setItem('userApplication', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  } 

  getElevById(elevId: number, bearer: string)
  {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + bearer);    
    return this.http.get(this.baseUrl + 'elevi/getelevbyid/' + elevId, {headers}).pipe(
      map((response: Elev) => {
        let elev: Elev = new Elev();
        elev.id = response.id;
        elev.displayName = response.displayName;
        elev.email = response.email;
        elev.numarDeTelefon = response.numarDeTelefon,
        elev.locatieId = response.locatieId,
        elev.locatie = response.locatie;
        elev.nivelId = response.nivelId;
        elev.nivel = response.nivel;
        elev.numarSedinte = response.numarSedinte;
        return elev;
      })
    );
  }

  editElev(elev: Elev, token: string) {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post(this.baseUrl + 'elevi/edituser', elev, { headers });
  }

  getNrSedinteRamase(token: string){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<number>(this.baseUrl + 'elevi/getnrsedinteramase', { headers });
  }

  changeParola(parolaCurenta: string, parolaNoua: string, parolaNouaRe: string, token: string){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post<any>(this.baseUrl + 'account/changeparola', 
    {
      ParolaCurenta: parolaCurenta,
      ParolaNoua: parolaNoua,
      ParolaNouaRe: parolaNouaRe
    }, { headers });
  }

  recupereazaParola(email: string){
    return this.http.get<any>(this.baseUrl + 'account/resetpassword/' + email);
  }  

  schimbaParola(email: string, token: string, parolanoua: string){
    return this.http.post<any>(this.baseUrl + 'account/schimbaparola', {
      Email: email,
      Token: token,
      ParolaNoua: parolanoua
    });
  }    

  createOauthFacebookAccount(registerDto: RegisterOauthDTO){
    return this.http.post<any>(this.baseUrl + 'account/oauthregister',
    {DisplayName: registerDto.displayName,
    Email: registerDto.email,
    LocatieNumar: registerDto.locatieNumar}).pipe(
      map((response: IUser) => {
        const user = response;
        if(user)
        {
          const roles = this.getDecodedToken(user.token).role;
          user.roles = [];
          Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
          localStorage.setItem('userApplication', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  getAllElevi(bearer: string){
    let userR: IUser;
    this.currentUser$.pipe(take(1)).subscribe(user => {
      userR = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + bearer);
    return this.http.get<Elev[]>(this.baseUrl + 'account/getallelevi', {headers}).pipe(
      map(response => {
        let elevi: Elev[] = [];

        response.forEach(elv => {
          let e: Elev = new Elev;
          e.id = elv.id;
          e.displayName = elv.displayName;
          e.email = elv.email;
          e.numarDeTelefon = elv.numarDeTelefon,
          e.locatieId = elv.locatieId,
          e.nivelId = elv.nivelId;
          e.numarSedinte = elv.numarSedinte;
          e.locatie = elv.locatie;
          e.nivel = elv.nivel;
          elevi.push(e);
        });

        return elevi;
      })
    );

  }

  getGoogleLoginUrl()
  {
    return this.http.get<AuthUrlDTO>(this.baseUrl + 'account/getgoogleloginurl');
  }

  getFacebookLoginUrl()
  {
    return this.http.get<AuthUrlDTO>(this.baseUrl + 'account/getfacebookloginurl');
  }


  getGoogleRegisterUrl()
  {
    return this.http.get<AuthUrlDTO>(this.baseUrl + 'account/getgoogleregisterurl');
  }

  getFacebookRegisterUrl()
  {
    return this.http.get<AuthUrlDTO>(this.baseUrl + 'account/getfacebookregisterurl');
  }  

  logOut(){
    localStorage.removeItem('userApplication');
    this.currentUserSource.next(null as any);
    this.router.navigateByUrl('/');
  }  

  loadCurrentUser(user: IUser){
    if(user == null && user == undefined)
    {
      this.currentUserSource.next(null);
      return of(null);
    }

    const roles = this.getDecodedToken(user.token).role;

    if(roles != null && roles != undefined)
    {
      user.roles = [];
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${user.token}`);

    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      map((userCheck: IUser) => {
        if(userCheck)
        {
          localStorage.setItem('userApplication', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  setCurrentUser(user: IUser)
  {
    this.currentUserSource.next(user);
  }

  getCurrentUser()
  {
    return localStorage.getItem('userApplication');
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }  
}
