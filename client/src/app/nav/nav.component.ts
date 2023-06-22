import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss', '../shared/style.scss']
})
export class NavComponent implements OnInit {
  isSidenavOpen = false;
  currentUser$: Observable<IUser>;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
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
