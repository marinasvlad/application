import { Component } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: any;
  constructor(public accountService: AccountService){
  }
  ngOnInit(){
    this.loadCurrentUser();
  }

  loadCurrentUser(){
    this.user = localStorage.getItem('userApplication');
    this.accountService.loadCurrentUser(JSON.parse(this.user)).subscribe(() => {
    }, error =>{
      console.log(error);
    });
  }  
}
