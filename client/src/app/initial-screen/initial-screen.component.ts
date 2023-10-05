import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { ReplaySubject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-initial-screen',
  templateUrl: './initial-screen.component.html',
  styleUrls: ['./initial-screen.component.scss']
})
export class InitialScreenComponent implements OnInit {
  baseUrl = environment.apiUrl;
  confirmareCerere: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private location: Location) { }

  signInVisible:boolean = false;
  registerVisible:boolean = false;
  registerGoogleVisible:boolean = false;
  initialButtonsVisible:boolean = true;
  oauthAccount: string = '';
  confirmareAlert: boolean = false;


  private currentUserSource = new ReplaySubject<IUser>(1);

  ngOnInit(): void {
    this.handleGoogleResponse();
  }

  inapoiClick(){
    this.signInVisible = false;
    this.registerVisible = false;
    this.initialButtonsVisible = true;
    this.registerGoogleVisible = false;
  }

  signInClick(){
    this.signInVisible = true;
    this.initialButtonsVisible = false;
  }

  registerClick(){
    this.registerVisible = true;
    this.initialButtonsVisible = false;
  }

  handleValueFromChild(value: string) {
    this.confirmareCerere = value;
    if(this.confirmareCerere == 'success')
    {
      this.signInVisible = false;
      this.registerVisible = false;
      this.initialButtonsVisible = true;
      this.registerGoogleVisible = false;
      this.confirmareAlert = true;
    }
  }


  handleGoogleResponse() {
    this.route.queryParams.subscribe(oauthResponse => {
      if(oauthResponse['state'] == 'googlelogin')
      {
        const authCode = oauthResponse['code'];
        if (authCode) {
          this.http.post<any>(this.baseUrl + 'account/googlelogin', {code: authCode}).pipe(
            map((response: IUser) => {
              const user = response;
              console.log("response: ");
              console.log(response);
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
      else if (oauthResponse['state'] == 'googleregister')
      {
        const authCode = oauthResponse['code'];
        if (authCode) {
          this.http.post<any>(this.baseUrl + 'account/getgooglepayload', {code: authCode}).subscribe((resp: string) => {
            this.oauthAccount = JSON.stringify(resp);
            this.location.go('');
            this.registerClick();
          });
        }
      }
      else if (oauthResponse['state'] == 'facebooklogin')
      {
        const authCode = oauthResponse['code'];
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
      else if (oauthResponse['state'] == 'facebookregister')
      {
        const authCode = oauthResponse['code'];
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
