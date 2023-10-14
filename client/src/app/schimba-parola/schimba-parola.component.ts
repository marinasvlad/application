import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-schimba-parola',
  templateUrl: './schimba-parola.component.html',
  styleUrls: ['./schimba-parola.component.scss']
})
export class SchimbaParolaComponent implements OnInit {
  @Input() email: string;
  @Input() token: string;
  @Output() parolaSchimbataSuccess = new EventEmitter<string>();

  parolaNoua: string = '';

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    console.log(this.token);
  }

  schimbaParola(){
    this.accountService.schimbaParola(this.email, this.token, this.parolaNoua).subscribe(res => {
      if(res['mesaj'] == 'success')
      {
        this.parolaSchimbataSuccess.emit('success');
      }
    });
  }  

}
