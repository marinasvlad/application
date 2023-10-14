import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-parola-uitata',
  templateUrl: './parola-uitata.component.html',
  styleUrls: ['./parola-uitata.component.scss', '../shared/style.scss']
})
export class ParolaUitataComponent implements OnInit {

  email: string;
  @Output() parolaSchimbataSuccess = new EventEmitter<string>();

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  recupereazaParola(){
    this.accountService.recupereazaParola(this.email).subscribe(res => {
      if(res['mesaj'] == 'success')
      {
        this.parolaSchimbataSuccess.emit("success");
      }
    });
  }

}
