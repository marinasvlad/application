import { Component, Input, OnInit, Self } from '@angular/core';
import {  FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { RegisterDTO } from '../models/registerDTO';
import { RegisterOauthDTO } from '../models/registerOauthDTO';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() oauthAccount: string;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  imgWidthVariable: string;

  googleLogoUrl: string = "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";
  facebookLogoUrl: string = "https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg";  

  locatieSelectata: number = 0;

  selectedCard: number | null = null;

  contNouStepperVisible: boolean = false;
  contNouStepperOauthVisible: boolean = false;
  numeSiPrenume: string;
  email: string;
  parola: string;
  registerOauthDTO: RegisterOauthDTO = new RegisterOauthDTO();

  selectCard(cardNumber: number) {
    this.selectedCard = cardNumber;
    this.locatieSelectata = cardNumber;
    this.registerOauthDTO.locatieNumar = cardNumber;
  }
  
  constructor(private _formBuilder: FormBuilder, private accountService: AccountService) { 
    this.calculateImageClass();
    window.addEventListener('resize', () => this.calculateImageClass()); 
  }

  calculateImageClass() {
    if(window.innerWidth <= 422){
      this.imgWidthVariable = 'mat-card-sm-image';
    }
    else if(window.innerWidth >= 520 && window.innerWidth <= 600)
    {
      this.imgWidthVariable = 'mat-card-md-image';
    }
    else if(window.innerWidth >= 1000)
    {
      this.imgWidthVariable = 'mat-card-xl-image';
    }
  }  

  ngOnInit(): void {
    if(this.oauthAccount != '')
    {
      this.processOauthRegisterAccount(this.oauthAccount);
    }
  }

  contNou(){
  this.contNouStepperVisible = true;
  }

  renunta(){
    this.contNouStepperVisible = false;
    this.contNouStepperOauthVisible = false;
  }

  registerGoogle() {
    this.accountService.getGoogleRegisterUrl().subscribe(res => {
      window.location.href = res.url;
    });
  }

  registerFacebook(){
    this.accountService.getFacebookRegisterUrl().subscribe(res =>{
      window.location.href = res.url;
    });
  }
  creazaCont(){
    let registerDTO = new RegisterDTO();
    registerDTO.displayName = this.numeSiPrenume;
    registerDTO.email = this.email;
    registerDTO.parola = this.parola;
    registerDTO.locatieNumar = this.locatieSelectata;
    this.accountService.registerCont(registerDTO).subscribe(() => {
      window.location.reload();
    })
  }

  createGoogleOauthAccount(){
    this.accountService.createOauthGoogleAccount(this.registerOauthDTO).subscribe(() => {
      window.location.reload();
    });
  }

  createFacebookOauthAccount(){
    this.accountService.createOauthFacebookAccount(this.registerOauthDTO).subscribe(() => {
      window.location.reload();
    });
  }  

  processOauthRegisterAccount(oauthJsonString: string)
  {
    let oauthJSON = JSON.parse(oauthJsonString);    
    this.registerOauthDTO.displayName = oauthJSON["DisplayName"];
    this.registerOauthDTO.email = oauthJSON["Email"];
    this.registerOauthDTO.provider = oauthJSON["Provider"];
    this.contNouStepperOauthVisible = true;
  }
}
