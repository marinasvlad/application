import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { IUser } from '../models/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  imgSrc: string;
  googleLoginUrl: string;
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private router: Router,private authService: SocialAuthService, private http: HttpClient, private accountService: AccountService, private route: ActivatedRoute) 
  {
    this.authService.authState.subscribe((user: SocialUser) => {
      this.http.post<any>(this.baseUrl + 'account/logingoogle', { idToken: user.idToken }).pipe(          
        //mapez raspunsu de pe backend cu modelu IUser de pe front
        map((response: IUser) => {
          const user = response;
          if(user){
            const roles = this.getDecodedToken(user.token).role;
            user.roles = [];
            Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
            localStorage.setItem('userApplication', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        })
      ).subscribe(response => {
        console.log('Success!');
      }, error => {
        console.log(error);
      });
  });
  }

  ngOnInit(): void {
    this.imgSrc = '../../assets/btn_google_signin_light_normal_web.png';    
  }

  signInWithGoogle(): void {
    //console.log('here!');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }

  signInGoogle(){

    this.accountService.getUrlGoogleLogin().subscribe(res => {
      window.location.href = res;
      this.route.queryParams.subscribe(response => {
        map((response: IUser) => {
          const user = response;
          if(user){
            const roles = this.getDecodedToken(user.token).role;
            user.roles = [];
            Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
            localStorage.setItem('userApplication', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        })
      });
    });
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }

}
