import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Prezenta } from '../models/prezenta';
import { IUser } from '../models/user';
import { AnuntService } from '../services/anunt.service';
import { PrezenteService } from '../services/prezente.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { Elev } from '../models/elev';

@Component({
  selector: 'app-prezente',
  templateUrl: './prezente.component.html',
  styleUrls: ['./prezente.component.scss' , '../shared/style.scss']
})
export class PrezenteComponent implements OnInit {
  user: IUser;
  prezente: Prezenta[];
  locatieId:number = 4;

  myControl = new FormControl('');
  elevi: Elev[] = [];
  filteredOptions: Observable<Elev[]>;

  constructor(private anuntService: AnuntService, private datePipe: DatePipe, private prezenteService: PrezenteService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.getUser();
    this.getAllElevi();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    if(this.user.roles.includes("Moderator") || this.user.roles.includes("Admin"))
    {
      this.getToatePrezentele();
    }  
  }

  private _filter(value: string): Elev[] {
    const filterValue = value.toLowerCase();

    return this.elevi.filter(elev => elev.displayName.toLowerCase().includes(filterValue));
  }

  getUser(){
    this.user = this.anuntService.getCurrentUser();
  }

  getAllElevi(){
    this.elevi = [];
    this.accountService.getAllElevi(this.user.token).subscribe(res => {
      this.elevi = res;
    })
  }

  getToatePrezentele(){
    this.prezente = [];
    this.prezenteService.getPrezenteTotiElevii().subscribe(res => {
      this.prezente = res;
    });
  }

  getPrezenteForElevById(userId: number)
  {
    this.prezente = [];
    this.prezenteService.getPrezenteByUserId(userId).subscribe(res => {
      this.prezente = res;
    })
  }
}
