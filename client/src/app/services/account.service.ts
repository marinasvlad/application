import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { AuthUrlDTO } from '../dtos/AuthUrlDTO';
import { RegisterDTO } from '../models/registerDTO';
import { RegisterGoogleDTO } from '../models/registerGoogleDTO';

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

  registerContGoogle(registerDto: RegisterGoogleDTO){
    return this.http.post<any>(this.baseUrl + 'account/registergoogle',
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

  getUrlGoogleLogin()
  {
    return this.http.get<AuthUrlDTO>(this.baseUrl + 'account/geturlgooglelogin');
  }

  getUrlFacebookLogin()
  {
    return this.http.get<AuthUrlDTO>(this.baseUrl + 'account/geturlfacebooklogin');
  }


  getUrlGoogleRegister()
  {
    return this.http.get<AuthUrlDTO>(this.baseUrl + 'account/geturlgoogleloginforregister');
  }  

  logOut(){
    //stergem useru din localstorage
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
