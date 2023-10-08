import { Component, OnInit, TemplateRef } from '@angular/core';
import { Inscriere } from '../models/inscriere';
import { InscrieriService } from '../services/inscrieri.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-inscrieri',
  templateUrl: './inscrieri.component.html',
  styleUrls: ['./inscrieri.component.scss', '../shared/style.scss']
})
export class InscrieriComponent implements OnInit {

  inscrieri: Inscriere[] = [];
  selectedCard: number | null = null;
  locatieSelectata: number = 0;
  imgWidthVariable: string;
  modalRef?: BsModalRef;
  inscriereToAccept: Inscriere = null;
  inscriereToDelete: Inscriere = null;

  constructor(private inscrieriService: InscrieriService, private modalService: BsModalService) {
    this.calculateImageClass();
    window.addEventListener('resize', () => this.calculateImageClass());        
   }

  ngOnInit(): void {
    this.getInscrieri();
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
      this.imgWidthVariable = 'mat-card-lg-image';
    }
  }

  openModalAccept(template: TemplateRef<any>, indexInscriere: number){
    this.inscriereToAccept = this.inscrieri[indexInscriere];
    this.modalRef = this.modalService.show(template);
  }

  openModalRefuza(template: TemplateRef<any>, indexInscriere: number){
    this.inscriereToDelete = this.inscrieri[indexInscriere];
    this.modalRef = this.modalService.show(template);
  }  

  acceptaInscriere(inscriereAceptata: Inscriere)
  {
    this.inscrieriService.acceptaInscriere(inscriereAceptata).subscribe(() =>{
      this.inscriereToAccept = null;
      this.inscriereToDelete = null;
      this.inscrieri = [];
      this.inscrieriService.getInscrieri().subscribe(res => {
        this.inscrieri = res;
        this.modalRef?.hide();
      });
    });
  }

  refuzaInscrierea(inscriereRefuzataId: number)
  {
    this.inscrieriService.refuzaInscriere(inscriereRefuzataId).subscribe(() =>{
      this.inscriereToAccept = null;
      this.inscriereToDelete = null;
      this.inscrieri = [];
      this.inscrieriService.getInscrieri().subscribe(res => {
        this.inscrieri = res;
        this.modalRef?.hide();
      });
    });
  }  

  getInscrieri(){
    this.inscrieri = [];
    this.inscrieriService.getInscrieri().subscribe(res => {
      this.inscrieri = res;
    });
  }


  selectCard(cardNumber: number, indexInscriere: number) {
    this.selectedCard = cardNumber;
    this.inscrieri[indexInscriere].locatieId = cardNumber;
  }

  turnSelectedCardNull(){
    this.selectedCard = null;
  }
}
