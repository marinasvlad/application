import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { Anunt } from '../models/anunt';

@Injectable({
  providedIn: 'root'
})
export class AnuntService {
  baseUrl = environment.apiUrl;
  user: IUser;
  private datePipe: DatePipe = new DatePipe('en-US');
  constructor(private http: HttpClient, private accountService: AccountService) { }


  getAnunturi(){
  this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
  this.user = user;
});
  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + this.user.token);

    return this.http.get<Anunt[]>(this.baseUrl + 'anunt', {headers});
  }

  postAnunt(anunt: Anunt){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.user.token);
      return this.http.post(this.baseUrl + 'anunt', {Text: anunt.text},{headers})
    }

    deleteAnunt(id: number){
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
      });
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + this.user.token);
        return this.http.delete(this.baseUrl + 'anunt/' + id,{headers})
      }
}
