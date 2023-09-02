import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { RegisterDTO } from '../models/registerDTO';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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

  numeSiPrenume: string;
  email: string;
  parola: string;

  selectCard(cardNumber: number) {
    this.selectedCard = cardNumber;
    this.locatieSelectata = cardNumber;
  }
  
  
  constructor(private _formBuilder: FormBuilder, private accountService: AccountService) { }

  ngOnInit(): void {
  }

  contNou(){
  this.contNouStepperVisible = true;
  }

  renunta(){
    this.contNouStepperVisible = false;
  }

  creazaCont(){
    let registerDTO = new RegisterDTO();
    registerDTO.displayName = this.numeSiPrenume;
    registerDTO.email = this.email;
    registerDTO.parola = this.parola;
    registerDTO.locatieNumar = this.locatieSelectata;
    this.accountService.registerCont(registerDTO).subscribe(() => {
    })
  }
}
