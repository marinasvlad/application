import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError, delay, tap } from "rxjs/operators";
import { AccountService } from "../services/account.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private accountService: AccountService, private toastr: ToastrService, private router: Router){
    }
    //interceptoru trimite eroare daca e vreo eroare de tipu 401 unauthorized(daca nu si-a scris bine emailu sau parola), toastu o sa puna in dreapta jos eroarea cu rosu si useru o sa ii dea x
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            delay(1000),           
            catchError(error => {
                if(error)
                {
                    if(error.status == 400)
                    {
                        if(error.error.errors){
                            throw error.error;
                        }
                        else
                        {
                            this.toastr.error(error.error.message, error.error.statusCode)
                        }
                    }
                    if(error.status == 401)
                    {
                        console.log('in 401');
                        this.toastr.error(error.error.message, error.error.statusCode)
                    }
                    if(error.status == 417)
                    {
                        this.toastr.error("Sesiunea a expirat, trebuie sa te loghezi din nou! ", "417");
                        this.accountService.logOut();
                        setTimeout(() => {
                            window.location.reload();
                          }, 1050);                     
                    }             
                }
                return throwError(error);
            })

        );
    }

}
