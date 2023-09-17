import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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

  locatieIdInDrop: number = 0; 
  modalRef?: BsModalRef;
  dataSelectata: Date;
  bsInlineValue: Date;
  oraGrupa: Date;
  locatiiDropInModal: Locatie[] = [
    {value: 1, viewValue: 'Waterpark'},
    {value: 2, viewValue: 'Imperial Garden'},
    {value: 3, viewValue: 'Bazinul Carol'}
    ];

  constructor(private modalService: BsModalService, private datePipe: DatePipe) { }

  ngOnInit(): void {
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
  }  

  postGrupa(){

  }
}
