import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Grupa } from '../models/grupa';
import { GrupeService } from '../services/grupe.service';
import { IUser } from '../models/user';
import { AnuntService } from '../services/anunt.service';

interface Locatie {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-grupe',
  templateUrl: './grupe.component.html',
  styleUrls: ['./grupe.component.scss', '../shared/style.scss']
})
export class GrupeComponent implements OnInit {
  user: IUser;
  locatieIdInDrop: number = 0; 
  modalRef?: BsModalRef;
  dataSelectata: Date;
  bsInlineValue: Date;
  oraGrupa: Date;

  imgWidthVariable: string;

  grupeActive: Grupa[] = [];
  grupeAnterioare: Grupa[] = [];
  urmatoareaGrupaActiva: Grupa = undefined;

  locatiiDropInModal: Locatie[] = [
    {value: 1, viewValue: 'Waterpark'},
    {value: 2, viewValue: 'Imperial Garden'},
    {value: 3, viewValue: 'Bazinul Carol'}
    ];

  constructor(private modalService: BsModalService, private datePipe: DatePipe, private grupeService: GrupeService, private anuntService: AnuntService) { 
    this.calculateImageClass();
    window.addEventListener('resize', () => this.calculateImageClass());    
  }

  calculateImageClass() {
    if(window.innerWidth <= 420){
      this.imgWidthVariable = 'mat-card-sm-image';
    }
    else if(window.innerWidth >= 520 && window.innerWidth <= 600)
    {
      this.imgWidthVariable = 'mat-card-md-image';
    }
    else if(window.innerWidth >= 600)
    {
      this.imgWidthVariable = 'mat-card-lg-image';
    }
  }

  

  ngOnInit(): void {
   this.getUser();
   
   if(this.user.roles.includes("Moderator") || this.user.roles.includes("Admin"))
   {
    this.getToateGrupeleActive();
   }
   else if(this.user.roles.includes("Member"))
   {
    this.getUrmatoareaGrupaActiva();
   }
  }

  getUrmatoareaGrupaActiva(){
    this.grupeService.getUrmatoareaGrupaActiva().subscribe(res => {
      this.urmatoareaGrupaActiva = res;
      console.log(this.urmatoareaGrupaActiva);
    });
  }

  particip(grupaId: number){
    this.grupeService.particip(grupaId).subscribe(() => {
      this.getUrmatoareaGrupaActiva();
    });
  }

  renunt(grupaId: number)
  {
    this.grupeService.renunt(grupaId).subscribe(() => {
      this.getUrmatoareaGrupaActiva();
    });
  }

  getToateGrupeleActive(){
    this.grupeService.getToateGrupeleActive().subscribe(res => {
      this.grupeActive = res;
    });
  }

  getUser(){
    this.user = this.anuntService.getCurrentUser();
  }
  


  openModal(template: TemplateRef<any>){
    this.locatieIdInDrop = 0;
    this.dataSelectata = undefined;
    this.oraGrupa = undefined;
    this.modalRef = this.modalService.show(template);
  }

  changeLocatieDrop(locatie: Locatie){
    this.locatieIdInDrop = locatie.value;
  }

  changedate(event: any)
  {
    this.dataSelectata = event;
    this.oraGrupa = event;
    this.oraGrupa.setMinutes(0);
    this.oraGrupa.setHours(0);
  }  

  postGrupa(){
    let grupa = new Grupa();
    grupa.dataGrupa = this.dataSelectata;
    grupa.oraGrupa = this.oraGrupa;
    grupa.locatieId = this.locatieIdInDrop;
    this.grupeService.postGrupa(grupa).subscribe(() =>{
      this.modalRef?.hide();
      this.getToateGrupeleActive();
    });
  }

  deleteGrupa(grupaId: number){
    this.grupeService.deleteGrupa(grupaId).subscribe(() => {
      this.getToateGrupeleActive();
    });
  }
}
