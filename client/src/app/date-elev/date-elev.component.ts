import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Prezenta } from '../models/prezenta';
import { IUser } from '../models/user';
import { AccountService } from '../services/account.service';
import { AnuntService } from '../services/anunt.service';
import { PrezenteService } from '../services/prezente.service';

@Component({
  selector: 'app-date-elev',
  templateUrl: './date-elev.component.html',
  styleUrls: ['./date-elev.component.scss', '../shared/style.scss']
})
export class DateElevComponent implements OnInit {
  user: IUser;
  numarSedinteRamase: number;
  prezenteUser: Prezenta[];
  parolaCurenta: string;
  parolaNoua: string;
  parolaNouaRe: string;
  modalRef?: BsModalRef;



  constructor(private accountService: AccountService, private anuntService: AnuntService,
     private prezenteService: PrezenteService, private modalService: BsModalService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getNumarSedinteRamase();
    this.getPrezenteForUser();
  } 

  getNumarSedinteRamase()
  {
    this.user = this.anuntService.getCurrentUser();
    this.accountService.getNrSedinteRamase(this.user.token).subscribe(res => {
      this.numarSedinteRamase = res;
    });
  }


  getPrezenteForUser(){
    this.prezenteUser = [];
    this.prezenteService.getPrezentaForMember().subscribe(res => {
      this.prezenteUser = res;
    })
  }

  schimbaParola(){
    this.user = this.anuntService.getCurrentUser();
    this.accountService.changeParola(this.parolaCurenta, this.parolaNoua, this.parolaNouaRe, this.user.token).subscribe(res=>{
      if(res['mesaj'] == 'success')
      {
        this.openSnackBar("Parola a fost schimbată", "Ok");
        this.parolaCurenta = '';
        this.parolaNoua = '';
        this.parolaNouaRe = '';
        this.modalRef?.hide();
      }
    });
  }

  openSnackBar(mesaj: string, actiune: string) {
    this._snackBar.open(mesaj, actiune)
  }

  inchideModal(template: TemplateRef<any>){
    this.parolaNoua = '';
    this.parolaCurenta = '';
    this.parolaNouaRe = '';
    this.modalRef?.hide();
  }
  
  schimbaParolaModal(template: TemplateRef<any>){
    this.parolaNoua = '';
    this.parolaCurenta = '';
    this.parolaNouaRe = '';
    this.modalRef = this.modalService.show(template);
  }
}
