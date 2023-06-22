import { Component, OnInit } from '@angular/core';
import { AnuntService } from '../services/anunt.service';
import { Anunt } from '../models/anunt';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss','../shared/style.scss']
})
export class HomeComponent implements OnInit {
  anunturi: Anunt[];
  constructor(private anuntService: AnuntService) { }

  ngOnInit(): void {
    this.anuntService.getAnunturi().subscribe(anunturi => {
      this.anunturi = anunturi;
    })
  }

}
