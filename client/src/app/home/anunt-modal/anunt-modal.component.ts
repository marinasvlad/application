import { Component, OnInit } from '@angular/core';
import { Anunt } from 'src/app/models/anunt';
import { AnuntService } from 'src/app/services/anunt.service';

@Component({
  selector: 'app-anunt-modal',
  templateUrl: './anunt-modal.component.html',
  styleUrls: ['./anunt-modal.component.scss']
})
export class AnuntModalComponent implements OnInit {

  constructor(private anuntService: AnuntService) { }
  inputValue: string = '';
  ngOnInit(): void {
  }

  postAnunt(){
    let anunt: Anunt = new Anunt();
    anunt.text = this.inputValue;
    this.anuntService.postAnunt(anunt).subscribe();
  }

}
