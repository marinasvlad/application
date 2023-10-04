import { Component, Input, OnInit, Self } from '@angular/core';
import {  FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { RegisterDTO } from '../models/registerDTO';
import { RegisterOauthDTO } from '../models/registerOauthDTO';

interface Nivel {
  value: string;
  viewValue: string;
}

interface Varsta {
  value: number;
  viewValue: string;
}


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

  varsta: number;

  numarDeTelefon: string;

  nivele: Nivel[] = [
    {value: 'incepator', viewValue: 'Începător'},
    {value: 'mediu', viewValue: 'Mediu'},
    {value: 'avansat', viewValue: 'Avavnsat'},
  ];

  varste: Varsta[] = [
    {value: 7, viewValue: '7 ani'},
    {value: 8, viewValue: '8 ani'},
    {value: 9, viewValue: '9 ani'},
    {value: 10, viewValue: '10 ani'},
    {value: 11, viewValue: '11 ani'},
    {value: 12, viewValue: '12 ani'},
    {value: 13, viewValue: '13 ani'},
    {value: 14, viewValue: '14 ani'},
    {value: 15, viewValue: '15 ani'},
    {value: 16, viewValue: '16 ani'},
    {value: 17, viewValue: '17 ani'},
    {value: 18, viewValue: '18 ani'},
    {value: 19, viewValue: 'Mai mult de 18 ani'}
  ];

  contNouStepperVisible: boolean = false;
  contNouStepperOauthVisible: boolean = false;
  numeSiPrenume: string;
  email: string;
  parola: string;
  nivel: string;
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
    registerDTO.nivel = this.nivel;
    registerDTO.numarDeTelefon = this.numarDeTelefon;
    registerDTO.varsta = this.varsta;
    this.accountService.registerCont(registerDTO).subscribe(res => {
      if(res["raspuns"] == "success")
      {
        
      }
    });
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
