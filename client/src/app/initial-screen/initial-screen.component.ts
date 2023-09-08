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

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private location: Location) { }

  signInVisible:boolean = false;
  registerVisible:boolean = false;
  registerGoogleVisible:boolean = false;
  initialButtonsVisible:boolean = true;
  googleAccount: string = '';
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


  handleGoogleResponse() {
    this.route.queryParams.subscribe(params => {
      console.log('here');
      console.log(params);
      const codeGoogle = params['code'];
      if(params['state'] == 'login')
      {
        if (codeGoogle) {
          this.http.post<any>(this.baseUrl + 'account/logingoogle', {code: codeGoogle}).pipe(
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
          })
        }
      }
      else if (params['state'] == 'register')
      {
        if (codeGoogle) {
          this.http.post<any>(this.baseUrl + 'account/logingoogleregister', {code: codeGoogle}).subscribe((resp: string) => {
            this.googleAccount = JSON.stringify(resp);
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
