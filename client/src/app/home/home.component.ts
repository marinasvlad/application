import { Component, OnInit } from '@angular/core';
import { AnuntService } from '../services/anunt.service';
import { Anunt } from '../models/anunt';
import { MatDialog } from '@angular/material/dialog';
import { AnuntModalComponent } from './anunt-modal/anunt-modal.component';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss','../shared/style.scss']
})
export class HomeComponent implements OnInit {
  anunturi: Anunt[];
  constructor(private anuntService: AnuntService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAnunturi();
  }

  getAnunturi(){
    this.anuntService.getAnunturi().subscribe(anunturi => {
      this.anunturi = anunturi;
    });
  }

  postAnunt(){
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AnuntModalComponent);
    dialogRef.afterClosed().subscribe(result => {    
      setTimeout(() => {
        this.getAnunturi();
      }, 500);
    });
  }

  stergeAnunt(id: number){
    this.anuntService.deleteAnunt(id).subscribe(res => {
      this.getAnunturi();
    });
  }
}
