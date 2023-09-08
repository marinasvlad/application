import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { RegisterDTO } from '../models/registerDTO';
import { RegisterGoogleDTO } from '../models/registerGoogleDTO';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() googleAccount: string;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  locatieSelectata: number = 0;

  selectedCard: number | null = null;

  contNouStepperVisible: boolean = false;
  contNouStepperGoogleVisible: boolean = false;
  numeSiPrenume: string;
  email: string;
  parola: string;
  registerGoogleDTO: RegisterGoogleDTO = new RegisterGoogleDTO();

  selectCard(cardNumber: number) {
    this.selectedCard = cardNumber;
    this.locatieSelectata = cardNumber;
    this.registerGoogleDTO.locatieNumar = cardNumber;
  }
  
  constructor(private _formBuilder: FormBuilder, private accountService: AccountService) { }

  ngOnInit(): void {
    if(this.googleAccount != '')
    {
      this.processGoogleRegisterAccount(this.googleAccount);
    }
  }

  contNou(){
  this.contNouStepperVisible = true;
  }

  renunta(){
    this.contNouStepperVisible = false;
    this.contNouStepperGoogleVisible = false;
  }

  signInGoogleRegister() {
    this.accountService.getUrlGoogleRegister().subscribe(res => {
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

  creazaContGoogle(){
    this.accountService.registerContGoogle(this.registerGoogleDTO).subscribe(() => {
      window.location.reload();
    });
  }

  processGoogleRegisterAccount(googleAccountObject: string)
  {
    let googleJSON = JSON.parse(googleAccountObject);    
    this.registerGoogleDTO.displayName = googleJSON["DisplayName"];
    this.registerGoogleDTO.email = googleJSON["Email"];
    this.contNouStepperGoogleVisible = true;
  }
}
