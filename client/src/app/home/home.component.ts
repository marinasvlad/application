import { Component, OnInit, TemplateRef } from '@angular/core';
import { AnuntService } from '../services/anunt.service';
import { Anunt } from '../models/anunt';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss','../shared/style.scss']
})
export class HomeComponent implements OnInit {
  anunturi: Anunt[];
  modalRef?: BsModalRef;
  inputValue: string = '';

  constructor(private anuntService: AnuntService, public dialog: MatDialog, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getAnunturi();
  }

  getAnunturi(){
    this.anuntService.getAnunturi().subscribe(anunturi => {
      this.anunturi = anunturi;
    });
  }

  stergeAnunt(id: number){
    this.anuntService.deleteAnunt(id).subscribe(res => {
      this.getAnunturi();
    });
  }

  openModal(template: TemplateRef<any>){
    this.inputValue = '';
    this.modalRef = this.modalService.show(template);
  }

  postAnunt(){
    let anunt: Anunt = new Anunt();
    anunt.text = this.inputValue;
    this.anuntService.postAnunt(anunt).subscribe(() => {
      this.modalRef?.hide();
      this.getAnunturi();
    });
  }  
}
