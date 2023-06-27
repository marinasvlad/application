import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError, delay } from "rxjs/operators";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private router: Router, private toastr: ToastrService){
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
                        this.toastr.error(error.error.message, error.error.statusCode)
                    }
                }
                return throwError(error);
            })
        );
    }

}
