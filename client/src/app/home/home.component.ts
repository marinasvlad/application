import { Component, OnInit, TemplateRef } from '@angular/core';
import { AnuntService } from '../services/anunt.service';
import { Anunt } from '../models/anunt';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from '../models/pagination';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss','../shared/style.scss']
})
export class HomeComponent implements OnInit {
  anunturi: Anunt[] = [];
  modalRef?: BsModalRef;
  inputValue: string = '';

  pagination: Pagination | undefined;

  pageNumber = 1;

  pageSize = 10;

  constructor(private anuntService: AnuntService, public dialog: MatDialog, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadAnunturi();
  }

  loadAnunturi(){
    this.anuntService.getAnunturi(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        if(response.pagination && response.result){
          this.anunturi = response.result;
          this.pagination = response.pagination;
        }
      }
    });
  }

  stergeAnunt(id: number){
    this.anuntService.deleteAnunt(id).subscribe(res => {
      this.loadAnunturi();
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
      this.loadAnunturi();
    });
  }

  pageChanged(event: any){
    if(this.pageNumber != event.page){
      this.pageNumber = event.page;
      this.loadAnunturi();
    }
  }
}
