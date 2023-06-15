import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isSidenavOpen = false;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }
  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout()
  {
    this.accountService.logOut();
    window.location.reload();
  }
}
