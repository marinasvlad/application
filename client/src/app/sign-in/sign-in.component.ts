import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../models/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { AccountService } from '../services/account.service';
import { GoogleAuthUrlDTO } from '../dtos/googleAuthUrlDTO';
import { StorageService } from '../services/storage.service';

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

  constructor(private router: Router, private http: HttpClient, private accountService: AccountService, private route: ActivatedRoute) {
    //   this.authService.authState.subscribe((user: SocialUser) => {
    //     this.http.post<any>(this.baseUrl + 'account/logingoogle', { idToken: user.idToken }).pipe(          
    //       //mapez raspunsu de pe backend cu modelu IUser de pe front
    //       map((response: IUser) => {
    //         const user = response;
    //         if(user){
    //           const roles = this.getDecodedToken(user.token).role;
    //           user.roles = [];
    //           Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    //           localStorage.setItem('userApplication', JSON.stringify(user));
    //           this.currentUserSource.next(user);
    //         }
    //       })
    //     ).subscribe(response => {
    //       console.log('Success!');
    //     }, error => {
    //       console.log(error);
    //     });
    // });
  }

  ngOnInit(): void {
    this.imgSrc = '../../assets/btn_google_signin_light_normal_web.png';
    this.handleGoogleResponse();
  }

  signInWithGoogle(): void {
    //console.log('here!');
    //this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }

  signInGoogle() {

    this.accountService.getUrlGoogleLogin().subscribe(res => {
      window.location.href = res.url;
    });
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handleGoogleResponse() {
    this.route.queryParams.subscribe(params => {
      const codeGoogle = params['code'];
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
          window.location.reload();
        })
      }
    });
  }

}
