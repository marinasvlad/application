import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { IUser } from '../models/user';
import { AnuntService } from '../services/anunt.service';
import { Prezenta } from '../models/prezenta';
import { PrezenteService } from '../services/prezente.service';

@Component({
  selector: 'app-prezente-elev',
  templateUrl: './prezente-elev.component.html',
  styleUrls: ['./prezente-elev.component.scss']
})
export class PrezenteElevComponent implements OnInit {
  user: IUser;
  numarSedinteRamase: number;
  prezenteUser: Prezenta[];
  constructor(private accountService: AccountService, private anuntService: AnuntService, private prezenteService: PrezenteService) { }

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
}
