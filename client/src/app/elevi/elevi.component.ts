import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Prezenta } from '../models/prezenta';
import { IUser } from '../models/user';
import { AnuntService } from '../services/anunt.service';
import { EleviService } from '../services/elevi.service';

@Component({
  selector: 'app-elevi',
  templateUrl: './elevi.component.html',
  styleUrls: ['./elevi.component.scss', '../shared/style.scss']
})
export class EleviComponent implements OnInit {
  user: IUser;
  prezente: Prezenta[];
  constructor(private anuntService: AnuntService, private datePipe: DatePipe, private eleviService: EleviService) { }

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
    this.eleviService.getPrezenteTotiElevii().subscribe(res => {
      this.prezente = res;
    });
  }

  getPrezenteMember(){
    this.prezente = [];
    this.eleviService.getPrezentaForMember().subscribe(res => {
      this.prezente = res;
    });
  }

}
