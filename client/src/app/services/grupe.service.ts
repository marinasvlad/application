import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { DatePipe } from '@angular/common';
import { AccountService } from './account.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Grupa } from '../models/grupa';
import { map, take } from 'rxjs/operators';
import { Elev } from '../models/elev';

@Injectable({
  providedIn: 'root'
})
export class GrupeService {
  baseUrl = environment.apiUrl;
  user: IUser;
  private datePipe: DatePipe = new DatePipe('en-US');


  constructor(private http: HttpClient, private accountService: AccountService) { }


  getToateGrupeleActive() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);

    return this.http.get<Grupa[]>(this.baseUrl + 'grupe/gettoategrupeleactive', { headers }).pipe(
      map(response => {
        let grupe: Grupa[] = [];
        response.forEach(element => {
          let grupa = new Grupa();
          grupa.id = parseInt(element["id"].toString());
          grupa.locatieId = parseInt(element["locatieId"].toString());
          grupa.dataGrupa = new Date(this.datePipe.transform(element["dataGrupa"], "YYYY-MM-dd HH:mm"));
          grupa.oraGrupa = new Date(this.datePipe.transform(element["oraGrupa"], "YYYY-MM-dd HH:mm"));
          grupa.confirmata = element["confirmata"];
          element["elevi"].forEach(elv => {
            let elev = new Elev();
            elev.displayName = elv["displayName"];
            elev.id = elv["id"];
            elev.locatie = elv["locatie"];
            elev.locatieId = elv["locatieId"];
            elev.numarSedinte = elv["numarSedinte"];
            elev.prezent = false;
            grupa.elevi.push(elev);
          });
          grupe.push(grupa);
        });

        return grupe;
      })
    );
  }

  confirmaGrupa(grupaId: number)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'grupe/confirmagrupa/' + grupaId, { headers });
  }

  renuntaLaConfirmare(grupaId: number)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'grupe/renuntalaconfirmare/' + grupaId, { headers });
  }  

  getUrmatoareaGrupaActiva() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);

    return this.http.get<Grupa>(this.baseUrl + 'grupe/geturmatoareagrupaactiva', { headers }).pipe(
      map(response => {
        let grupa = new Grupa();

        grupa.id = response["id"];
        grupa.locatieId = parseInt(response["locatieId"].toString());
        grupa.dataGrupa = new Date(this.datePipe.transform(response["dataGrupa"], "YYYY-MM-dd HH:mm"));
        grupa.oraGrupa = new Date(this.datePipe.transform(response["oraGrupa"], "YYYY-MM-dd HH:mm"));
        grupa.particip = response["particip"];
        grupa.confirmata = response["confirmata"];
        return grupa;
      })
    );
  }

  postGrupa(grupa: Grupa) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.post(this.baseUrl + 'grupe/postgrupa',
      {
        DataGrupa: this.datePipe.transform(grupa.dataGrupa, 'YYYY-MM-dd HH:mm'),
        OraGrupa: this.datePipe.transform(grupa.oraGrupa, 'YYYY-MM-dd HH:mm'),
        LocatieId: grupa.locatieId
      }, { headers });
  }

  efectueazaGrupa(grupa: Grupa) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.post(this.baseUrl + 'grupe/efectueazagrupacuprezente',
      {
        Id: grupa.id,
        LocatieId: grupa.locatieId,
        Elevi: grupa.elevi
      }, { headers });
  }  

  particip(grupaId: number) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'grupe/particip/' + grupaId, { headers });
  }

  renunt(grupaId: number) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'grupe/renunt/' + grupaId, { headers });
  }

  deleteGrupa(grupaId: number) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);

    return this.http.delete(this.baseUrl + 'grupe/deletegrupa/' + grupaId, { headers });
  }
}
