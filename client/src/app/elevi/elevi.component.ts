import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Prezenta } from '../models/prezenta';
import { IUser } from '../models/user';
import { AnuntService } from '../services/anunt.service';
import { PrezenteService } from '../services/prezente.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Elev } from '../models/elev';
import { map, startWith, take } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-elevi',
  templateUrl: './elevi.component.html',
  styleUrls: ['./elevi.component.scss', '../shared/style.scss']
})
export class EleviComponent implements OnInit {
  user: IUser;
  myControl = new FormControl('');
  filteredOptions: Observable<Elev[]>;
  elevi: Elev[] = [];
  eleviInDrop: Elev[] =  [];
  modalRef?: BsModalRef;
  indexElevToEdit: number;
  indexElevToBeDeleted: number;
  elevToBeEdited: Elev;
  elevToBeDeleted: Elev;
  constructor(private anuntService: AnuntService, private datePipe: DatePipe, private accountService: AccountService,private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUser();
    this.getAllElevi();
    this.getAllEleviInDrop();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  getUser(){
    this.user = this.anuntService.getCurrentUser();
  }

  private _filter(value: string): Elev[] {
    const filterValue = value.toLowerCase();

    return this.eleviInDrop.filter(elev => elev.displayName.toLowerCase().includes(filterValue));
  }  

  getAllElevi(){
    this.elevi = [];
    this.accountService.getAllElevi(this.user.token).subscribe(res => {
      this.elevi = res;
    })
  }

  getAllEleviInDrop(){
    this.eleviInDrop = [];
    this.accountService.getAllElevi(this.user.token).subscribe(res => {
      this.eleviInDrop = res;
    })
  }  

  getElevById(elevId: number)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    this.accountService.getElevById(elevId, this.user.token).subscribe(res => {
      this.elevi = [];
      this.elevi.push(res);
    });
  }

  inchideModalEditElevi(){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });    
    this.accountService.getAllElevi(this.user.token).subscribe(res => {
      this.elevi = res;
      this.elevToBeEdited = new Elev();
      this.modalRef?.hide();
    });
  }

  inchideModalDeleteElevi(){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });    
    this.accountService.getAllElevi(this.user.token).subscribe(res => {
      this.elevi = res;
      this.elevToBeDeleted = new Elev();
      this.modalRef?.hide();
    });
  }  


  scadeSedinta(elev: Elev)
  {
    elev.numarSedinte = elev.numarSedinte - 1;
  }  

  adaugaSedinta(elev: Elev)
  {
    elev.numarSedinte = elev.numarSedinte + 1;
  }    

  editElev(elevToBeEdited: Elev)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });    
    this.accountService.editElev(elevToBeEdited,this.user.token).subscribe(() => {
      this.modalRef?.hide();
      window.location.reload();      
    });
  }

  deleteElev(elevToBeDeleted: Elev)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });    
    this.accountService.deleteElev(elevToBeDeleted.id,this.user.token).subscribe(() => {
      this.modalRef?.hide();
      window.location.reload();
    });
  }  

  openModalEditElev(indexElevToEdit: number, template: TemplateRef<any>) {
    this.indexElevToEdit = indexElevToEdit;
    this.elevToBeEdited = this.elevi[this.indexElevToEdit];
    this.modalRef = this.modalService.show(template);
  }

  openModalDeleteElev(indexElevToDelete: number, template: TemplateRef<any>) {
    this.indexElevToBeDeleted = indexElevToDelete;
    this.elevToBeDeleted = this.elevi[this.indexElevToBeDeleted];
    this.modalRef = this.modalService.show(template);
  }
  setLocatie(locatieId: number){
    this.elevToBeEdited.locatieId = locatieId;
  }

  setNivel(nivelId: number){
    this.elevToBeEdited.nivelId = nivelId;
  }  
}
