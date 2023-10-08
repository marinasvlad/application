import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { map, take } from 'rxjs/operators';
import { Inscriere } from '../models/inscriere';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class InscrieriService {
  baseUrl = environment.apiUrl;
  user: IUser;
  private datePipe: DatePipe = new DatePipe('en-US');

  constructor(private http: HttpClient, private accountService: AccountService) { }


  getInscrieri() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);

    return this.http.get<Inscriere[]>(this.baseUrl + 'inscrieri', { headers }).pipe(
      map(response => {
        let inscrieri: Inscriere[] = [];
        response.forEach(element => {
          let inscriere = new Inscriere();
          inscriere.id = parseInt(element["id"].toString());
          inscriere.displayName = element["displayName"].toString();
          inscriere.email = element["email"].toString();
          inscriere.numarDeTelefon = element["numarDeTelefon"].toString();
          inscriere.nivel = element["nivel"].toString();
          inscriere.varsta = parseInt(element["varsta"].toString());
          inscriere.dataCerere = new Date(this.datePipe.transform(element["dataCerere"], "YYYY-MM-dd HH:mm"));       
          inscriere.locatieId = 0;    
          inscrieri.push(inscriere);
        });

        return inscrieri;
      })
    );
  }


  acceptaInscriere(inscriere: Inscriere)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'inscrieri/acceptainscriere/' + inscriere.id + '/' + inscriere.locatieId, { headers });
  }

  refuzaInscriere(inscriereId: number)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'inscrieri/refuzainscriere/' + inscriereId , { headers });
  }
}
