import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }


  busy(){
    this.busyRequestCount++;
    this.spinnerService.show(undefined,{
        type: 'ball-pulse-sync',
        bdColor: 'rgba(255,255,255, 0.7)',
        color: '#333333',
        size: 'large',
      });
  }

  idle() {
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      setTimeout(() => {
        this.spinnerService.hide();
      }, 600);      
    }
  }
}
