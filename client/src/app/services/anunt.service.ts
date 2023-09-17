import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';
import { DatePipe } from '@angular/common';
import { map, take } from 'rxjs/operators';
import { Anunt } from '../models/anunt';
import { PaginatedResults } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class AnuntService {
  baseUrl = environment.apiUrl;
  user: IUser;
  private datePipe: DatePipe = new DatePipe('en-US');
  paginatedResults: PaginatedResults<Anunt[]> = new PaginatedResults<Anunt[]>();
  constructor(private http: HttpClient, private accountService: AccountService) { }

  getCurrentUser(){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    }); 
    
    return this.user;
  }


  getAnunturi(page?: number, itemsPerPage?: number){
  this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
  this.user = user;
});
  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + this.user.token);

  let params = new HttpParams();

  if(page && itemsPerPage){
    params = params.append("pageNumber", page);
    params = params.append("pageSize", itemsPerPage);
  }
    return this.http.get<Anunt[]>(this.baseUrl + 'anunt', {headers,observe: 'response', params}).pipe(
      map(response => {
        if(response.body){
          this.paginatedResults.result = response.body;
        }

        const pagination = response.headers.get("Pagination");
        if(pagination){
          this.paginatedResults.pagination = JSON.parse(pagination);
        }

        return this.paginatedResults;
      })
    );
  }

  getAnunturiCustom(page?: number, itemsPerPage?: number, locatieId?: number){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
    this.user = user;
  });
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.user.token);
  
    let params = new HttpParams();
  
    if(page && itemsPerPage && locatieId){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
      params = params.append("locationId", locatieId);
    }
      return this.http.get<Anunt[]>(this.baseUrl + 'anunt/getanunturicustom', {headers,observe: 'response', params}).pipe(
        map(response => {
          if(response.body){
            this.paginatedResults.result = response.body;
          }
  
          const pagination = response.headers.get("Pagination");
          if(pagination){
            this.paginatedResults.pagination = JSON.parse(pagination);
          }
  
          return this.paginatedResults;
        })
      );
    }  

  postAnunt(anunt: Anunt){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.user.token);
      return this.http.post(this.baseUrl + 'anunt', {Text: anunt.text, LocatieId: anunt.locatieId},{headers})
    }

    deleteAnunt(id: number){
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
      });
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + this.user.token);
        return this.http.delete(this.baseUrl + 'anunt/' + id,{headers})
      }

  getPageSize(){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'anunt/getpagesize', {headers});
  }
  
  getPageSizeCustom(locationId: number){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.user.token);
    return this.http.get(this.baseUrl + 'anunt/getpagesizecustom/' + locationId, {headers});
  }
}
