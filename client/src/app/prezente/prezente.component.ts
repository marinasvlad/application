import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Prezenta } from '../models/prezenta';
import { IUser } from '../models/user';
import { AnuntService } from '../services/anunt.service';
import { PrezenteService } from '../services/prezente.service';

@Component({
  selector: 'app-prezente',
  templateUrl: './prezente.component.html',
  styleUrls: ['./prezente.component.scss' , '../shared/style.scss']
})
export class PrezenteComponent implements OnInit {
  user: IUser;
  prezente: Prezenta[];
  locatieId:number = 4;

  constructor(private anuntService: AnuntService, private datePipe: DatePipe, private prezenteService: PrezenteService) { }

  ngOnInit(): void {
    this.getUser();
   
    if(this.user.roles.includes("Moderator") || this.user.roles.includes("Admin"))
    {
      this.getToatePrezentele();
    }
    else if(this.user.roles.includes("Member"))
    {
     this.getPrezenteMember();
    }    
  }

  getUser(){
    this.user = this.anuntService.getCurrentUser();
  }

  getToatePrezentele(){
    this.prezente = [];
    this.prezenteService.getPrezenteTotiElevii().subscribe(res => {
      this.prezente = res;
    });
  }

  getPrezenteMember(){
    this.prezente = [];
    this.prezenteService.getPrezentaForMember().subscribe(res => {
      this.prezente = res;
    });
  }
}
