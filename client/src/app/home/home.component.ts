import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AnuntService } from '../services/anunt.service';
import { Anunt } from '../models/anunt';
import { MatDialog } from '@angular/material/dialog';
import { delay, take } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from '../models/pagination';
import { IUser } from '../models/user';

interface Locatie {
  value: number;
  viewValue: string;
}

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
  user: IUser;

  pageSize = -1;
  variabila: number = 7;

  locatii: Locatie[] = [
    {value: 1, viewValue: 'Waterpark'},
    {value: 2, viewValue: 'Imperial Garden'},
    {value: 3, viewValue: 'Bazinul Carol'},
    {value: 4, viewValue: 'Toate locatiile'}
  ];
  
  locatieId:number = 4;

  constructor(private anuntService: AnuntService, public dialog: MatDialog, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUser();

    if(this.user.roles.includes("Moderator") || this.user.roles.includes("Admin"))
    {
      this.getPageSizeCustom(this.locatieId);
    }
    else if(this.user.roles.includes("Member"))
    {
      this.getUsersPageSize();
      this.loadAnunturi();
    }
  }

  getUser(){
    this.user = this.anuntService.getCurrentUser();
  }
  

  getUsersPageSize(){
    return this.anuntService.getPageSize().subscribe(res => {
      let pageSizeResponse: number = parseInt(res.toString());

      if(pageSizeResponse >= 10)
      {
        this.pageSize = 10
      }
      else if(pageSizeResponse > 1)
      {
        this.pageSize = 10;
      }
    }
    );
  }

  changeLocatie(locatie: Locatie){
    console.log('Ai selectat ' + locatie.value + ' cu idUl ' + locatie.viewValue);
    this.locatieId = locatie.value;
    this.getPageSizeCustom(this.locatieId);
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

  loadAnunturiCustom(locatieId: number){
    this.anuntService.getAnunturiCustom(this.pageNumber, this.pageSize, locatieId).subscribe({
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

  pageChangedCustom(event: any, locationId: number){
    if(this.pageNumber != event.page){
      if(this.user.roles.includes('Moderator'))
      {
        this.pageNumber = event.page;
        this.getPageSizeCustom(locationId);
      }
    }
  }  

  getPageSizeCustom(locationId: number)
  {
    this.anuntService.getPageSizeCustom(locationId).subscribe(res => {
      let pageSizeResponse: number = parseInt(res.toString());

      if(pageSizeResponse >= 10)
      {
        this.pageSize = 10
      }
      else if(pageSizeResponse > 1)
      {
        this.pageSize = 10;
      }
      this.loadAnunturiCustom(locationId);
    });
  }
}
