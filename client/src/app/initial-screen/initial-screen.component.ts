import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { ReplaySubject } from 'rxjs';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-initial-screen',
  templateUrl: './initial-screen.component.html',
  styleUrls: ['./initial-screen.component.scss']
})
export class InitialScreenComponent implements OnInit {
  baseUrl = environment.apiUrl;
  confirmareCerere: string = '';
  amUitatParola: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private location: Location, private _snackBar: MatSnackBar) { }

  signInVisible:boolean = false;
  registerVisible:boolean = false;
  registerGoogleVisible:boolean = false;
  initialButtonsVisible:boolean = true;
  oauthAccount: string = '';
  schimbaParolaVisible = false;
  tokenResetParola: string;
  emailSchimbParola: string;
  amUitatParolaVisible: boolean = false;

  private currentUserSource = new ReplaySubject<IUser>(1);

  ngOnInit(): void {
    this.handleResponse();
  }

  inapoiClick(){
    this.signInVisible = false;
    this.registerVisible = false;
    this.initialButtonsVisible = true;
    this.registerGoogleVisible = false;
    this.amUitatParolaVisible = false;
    this.schimbaParolaVisible= false;
  }

  signInClick(){
    this.signInVisible = true;
    this.initialButtonsVisible = false;
  }

  registerClick(){
    this.registerVisible = true;
    this.initialButtonsVisible = false;
  }

  handleParolaSchimbata(value: string)
  {
    if(value == 'success')
    {
      this.signInVisible = false;
      this.registerVisible = false;
      this.initialButtonsVisible = true;
      this.registerGoogleVisible = false;
      this.amUitatParolaVisible = false;
      this.schimbaParolaVisible = false;
      this.openSnackBar("Ți-am trimis pe email un link de schimbare a parolei", "Ok");
    }
  }  



  handleParolaSchimbataSuccess(value: string)
  {
    if(value == 'success')
    {
      this.signInVisible = false;
      this.registerVisible = false;
      this.initialButtonsVisible = true;
      this.registerGoogleVisible = false;
      this.amUitatParolaVisible = false;
      this.schimbaParolaVisible = false;
      this.openSnackBar("Parola a fost schimbată cu succes!", "Ok");
    }
  }  

  handleConfirmation(value: string) {
    this.confirmareCerere = value;
    if(this.confirmareCerere == 'success')
    {
      this.signInVisible = false;
      this.registerVisible = false;
      this.initialButtonsVisible = true;
      this.registerGoogleVisible = false;
      this.amUitatParolaVisible = false;
      this.schimbaParolaVisible = false;
      this.openSnackBar("Cerere înregistrată. Vei primi un email de activare a contului", "Ok");
    }
  }

  handleAmUitatParola(value: string) {
    this.amUitatParola = value;
    if(value == 'amUitatParola')
    {
      this.signInVisible = false;
      this.registerVisible = false;
      this.initialButtonsVisible = false;
      this.registerGoogleVisible = false;      
      this.amUitatParolaVisible = true;
      this.schimbaParolaVisible = false;
    }
  }  

  openSnackBar(mesaj: string, actiune: string) {
    this._snackBar.open(mesaj, actiune)
  }


  handleResponse() {
    this.route.queryParams.subscribe(params => {
      if(params['actiune'] == 'resetparola')
      {
        this.emailSchimbParola = params['email'];
        this.tokenResetParola = params['token'];
        this.signInVisible = false;
        this.registerVisible = false;
        this.initialButtonsVisible = false;
        this.registerGoogleVisible = false;      
        this.amUitatParolaVisible = false;        
        this.schimbaParolaVisible = true;
        this.location.go('');
      }
      if(params['state'] == 'googlelogin')
      {
        const authCode = params['code'];
        if (authCode) {
          this.http.post<any>(this.baseUrl + 'account/googlelogin', {code: authCode}).pipe(
            map((response: IUser) => {
              const user = response;

              if (user) {
                const roles = this.getDecodedToken(user.token).role;
                user.roles = [];
                Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
                localStorage.setItem('userApplication', JSON.stringify(user));
                this.currentUserSource.next(user);
              }
            })
          ).subscribe(resp => {
            this.router.navigate(['/']);
            setTimeout(() => {
              window.location.reload();
            }, 500);            
          });
        }
      }
      else if (params['state'] == 'googleregister')
      {
        const authCode = params['code'];
        if (authCode) {
          this.http.post<any>(this.baseUrl + 'account/getgooglepayload', {code: authCode}).subscribe((resp: string) => {
            this.oauthAccount = JSON.stringify(resp);
            this.location.go('');
            this.registerClick();
          });
        }
      }
      else if (params['state'] == 'facebooklogin')
      {
        const authCode = params['code'];
        if (authCode) {
          this.http.post<any>(this.baseUrl + 'account/facebooklogin', {code: authCode}).pipe(
            map((response: IUser) => {
              const user = response;
              if (user) {
                const roles = this.getDecodedToken(user.token).role;
                user.roles = [];
                Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
                localStorage.setItem('userApplication', JSON.stringify(user));
                this.currentUserSource.next(user);
              }
            })
          ).subscribe(resp => {
            this.router.navigate(['/']);
            setTimeout(() => {
              window.location.reload();
            }, 500);            
          });
        }
      }
      else if (params['state'] == 'facebookregister')
      {
        const authCode = params['code'];
        if (authCode) {
          this.http.post<any>(this.baseUrl + 'account/getfacebookpayload', {code: authCode}).subscribe((resp: string) => {
            this.oauthAccount = JSON.stringify(resp);
            this.location.go('');
            this.registerClick();
          });
        }
      }            

    });
  }
  
  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }  

}
