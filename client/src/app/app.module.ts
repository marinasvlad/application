import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignInComponent } from './sign-in/sign-in.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { GrupeComponent } from './grupe/grupe.component';
import { MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { EleviComponent } from './elevi/elevi.component';
import { ContactComponent } from './contact/contact.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AnuntModalComponent } from './home/anunt-modal/anunt-modal.component'; 
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card'; 
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    NavComponent,
    HomeComponent,
    GrupeComponent,
    EleviComponent,
    ContactComponent,
    AnuntModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatCardModule,
    MatSidenavModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatButtonToggleModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true 
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS,useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
