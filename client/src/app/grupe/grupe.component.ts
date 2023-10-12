import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Grupa } from '../models/grupa';
import { GrupeService } from '../services/grupe.service';
import { IUser } from '../models/user';
import { AnuntService } from '../services/anunt.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, roLocale } from 'ngx-bootstrap/chronos';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Elev } from '../models/elev';

interface Locatie {
  value: number;
  viewValue: string;
}

interface Nivel {
  value: string;
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
  bsInlineValueSplit: Date;

  oraGrupa: Date;

  grupaEfectuare: Grupa;
  grupaInitiala: Grupa;
  grupaToSplit: Grupa;

  dataGrupaSplit: Date;
  oraGrupaSplit: Date;

  imgWidthVariable: string;

  grupeActive: Grupa[] = [];
  grupeAnterioare: Grupa[] = [];
  urmatoareaGrupaActiva: Grupa = undefined;

  locatiiDropInModal: Locatie[] = [
    { value: 1, viewValue: 'Water Park' },
    { value: 2, viewValue: 'Imperial Garden' },
    { value: 3, viewValue: 'Bazinul Carol' }
  ];

  nivel: string = '';
  nivele: Nivel[] = [
    { value: 'incepator', viewValue: 'Începător' },
    { value: 'intermediar', viewValue: 'Intermediar' },
    { value: 'avansat', viewValue: 'Avavnsat' },
  ];

  constructor(private modalService: BsModalService, private datePipe: DatePipe, private grupeService: GrupeService, private anuntService: AnuntService, localeService: BsLocaleService) {
    defineLocale('ro', roLocale);
    localeService.use('ro');
    this.calculateImageClass();
    window.addEventListener('resize', () => this.calculateImageClass());
  }

  calculateImageClass() {
    if (window.innerWidth <= 420) {
      this.imgWidthVariable = 'mat-card-sm-image';
    }
    else if (window.innerWidth >= 520 && window.innerWidth <= 600) {
      this.imgWidthVariable = 'mat-card-lg-image';
    }
    else if (window.innerWidth >= 600) {
      this.imgWidthVariable = 'mat-card-xl-image';
    }
  }



  ngOnInit(): void {
    this.getUser();

    if (this.user.roles.includes("Moderator") || this.user.roles.includes("Admin")) {
      this.getToateGrupeleActive();
    }
    else if (this.user.roles.includes("Member")) {
      this.getUrmatoareaGrupaActiva();
    }
  }

  drop(event: CdkDragDrop<Elev[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }  

  getUrmatoareaGrupaActiva() {
    this.grupeService.getUrmatoareaGrupaActiva().subscribe(res => {
      this.urmatoareaGrupaActiva = res;
    });
  }

  efectueazaGrupa(grupaActiva: Grupa, template: TemplateRef<any>) {
    this.grupaEfectuare = grupaActiva;
    this.modalRef = this.modalService.show(template);
  }


  splitGrupaModal(grupaActiva: Grupa, template: TemplateRef<any>, indexGrupaInitiala: number) {
    //this.grupaEfectuare = grupaActiva;
    this.dataGrupaSplit = this.grupeActive[indexGrupaInitiala].dataGrupa;
    this.oraGrupaSplit = this.grupeActive[indexGrupaInitiala].oraGrupa;
    this.bsInlineValueSplit = this.grupeActive[indexGrupaInitiala].dataGrupa;
    this.grupaToSplit = new Grupa();
    this.grupaInitiala = this.grupeActive[indexGrupaInitiala];
    this.modalRef = this.modalService.show(template);
  }  

  particip(grupaId: number) {
    this.grupeService.particip(grupaId).subscribe(() => {
      this.getUrmatoareaGrupaActiva();
    });
  }

  renunt(grupaId: number) {
    this.grupeService.renunt(grupaId).subscribe(() => {
      this.getUrmatoareaGrupaActiva();
    });
  }

  getToateGrupeleActive() {
    this.grupeService.getToateGrupeleActive().subscribe(res => {
      this.grupeActive = res;
    });
  }

  getUser() {
    this.user = this.anuntService.getCurrentUser();
  }

  confirmaGrupa(grupaId: number) {
    this.grupeService.confirmaGrupa(grupaId).subscribe(() => {
      this.getToateGrupeleActive();
    });
  }

  elevPrezent(indexElevPrezent: number) {
    this.grupaEfectuare.elevi[indexElevPrezent].prezent = !this.grupaEfectuare.elevi[indexElevPrezent].prezent;
  }

  closeModalSplitGrupa(){
    this.grupeService.getToateGrupeleActive().subscribe(res => {
      this.grupeActive = res;
      this.modalRef?.hide();
    });
  }

  closeModalAdaugaGrupa(){
    this.modalRef?.hide();
    this.locatieIdInDrop = 0;
    this.nivel = '';
    this.dataSelectata = undefined;    
  }


  split(){
    this.grupaToSplit.dataGrupa = this.dataGrupaSplit;
    this.grupaToSplit.oraGrupa = this.oraGrupaSplit;
    this.grupeService.splitGrupa(this.grupaInitiala, this.grupaToSplit).subscribe(() => {
      this.modalRef?.hide();
      this.getToateGrupeleActive();
    });
  }

  renuntaLaConfirmare(grupaId: number) {
    this.grupeService.renuntaLaConfirmare(grupaId).subscribe(() => {
      this.getToateGrupeleActive();
    });
  }

  openModal(template: TemplateRef<any>) {
    this.locatieIdInDrop = 0;
    this.dataSelectata = undefined;
    this.oraGrupa = undefined;
    this.modalRef = this.modalService.show(template);
  }

  changeLocatieDrop(locatie: Locatie) {
    this.locatieIdInDrop = locatie.value;
  }

  changedate(event: any) {
    this.dataSelectata = event;
    this.oraGrupa = event;
    this.oraGrupa.setMinutes(0);
    this.oraGrupa.setHours(0);
  }

  changedateSplit(event: any) {
    this.dataGrupaSplit = event;
    this.oraGrupaSplit = event;
    this.oraGrupaSplit.setMinutes(0);
    this.oraGrupaSplit.setHours(0);
  }  

  postGrupa() {
    let grupa = new Grupa();
    grupa.dataGrupa = this.dataSelectata;
    grupa.oraGrupa = this.oraGrupa;
    grupa.locatieId = this.locatieIdInDrop;
    grupa.nivel = this.nivel;
    this.grupeService.postGrupa(grupa).subscribe(() => {
      this.modalRef?.hide();
      this.getToateGrupeleActive();
    });
  }

  efectueazaGrupaCuPrezente() {
    this.grupeService.efectueazaGrupa(this.grupaEfectuare).subscribe(() => {
      this.modalRef?.hide();
      this.getToateGrupeleActive();
    });
  }

  deleteGrupa(grupaId: number) {
    this.grupeService.deleteGrupa(grupaId).subscribe(() => {
      this.getToateGrupeleActive();
    });
  }
}
