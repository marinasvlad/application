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
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  user: any = {};
  imgSrc: string;
  googleLoginUrl: string;
  googleLogoUrl: string = "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";;
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private router: Router, private http: HttpClient, private accountService: AccountService, 
    private route: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(
        "googleLogo",
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.googleLogoUrl));    
  }

  ngOnInit(): void {
    this.imgSrc = '../../assets/btn_google_signin_light_normal_web.png';
  }


  signInGoogle() {
    this.accountService.getUrlGoogleLogin().subscribe(res => {
      window.location.href = res.url;
    });
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  signIn(){
    this.accountService.login(this.user).subscribe(res =>{
      window.location.reload();
    });
  }
}
