import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Prezenta } from '../models/prezenta';
import { IUser } from '../models/user';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PrezenteService {
  baseUrl = environment.apiUrl;
  user: IUser;
  private datePipe: DatePipe = new DatePipe('en-US');


  constructor(private http: HttpClient, private accountService: AccountService) { }


  getPrezenteTotiElevii() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get<Prezenta[]>(this.baseUrl + 'prezente/getprezentetotielevii', { headers })
    .pipe(
      map(response => {
        let prezente: Prezenta[] = [];
        response.forEach(element => {
          let prezenta = new Prezenta();
          prezenta.id = parseInt(element["id"].toString());
          prezenta.locatie = element["locatie"].toString();
          prezenta.displayName = element["displayName"].toString();
          prezenta.email = element["email"].toString();
          prezenta.data =   new Date(this.datePipe.transform(element["data"], "YYYY-MM-dd HH:mm"));
          prezenta.start =   new Date(this.datePipe.transform(element["start"], "YYYY-MM-dd HH:mm"));
          prezenta.stop =   new Date(this.datePipe.transform(element["stop"], "YYYY-MM-dd HH:mm"));
          prezente.push(prezenta);
        });
        return prezente;
      })
    );
  }


  getPrezentaForMember() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);

    return this.http.get<Prezenta[]>(this.baseUrl + 'prezente/getprezenteformember', { headers }).pipe(
      map(response => {
        let prezente: Prezenta[] = [];
        response.forEach(element => {
          let prezenta = new Prezenta();
          prezenta.id = parseInt(element["id"].toString());
          prezenta.locatie = element["locatie"].toString();
          prezenta.displayName = element["displayName"].toString();
          prezenta.email = element["email"].toString();
          prezenta.data =   new Date(this.datePipe.transform(element["data"], "YYYY-MM-dd HH:mm"));
          prezenta.start =   new Date(this.datePipe.transform(element["start"], "YYYY-MM-dd HH:mm"));
          prezenta.stop =   new Date(this.datePipe.transform(element["stop"], "YYYY-MM-dd HH:mm"));
          prezente.push(prezenta);
        });

        return prezente;
      })
    );
  }  
}
