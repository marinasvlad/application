import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { DateElevComponent } from './date-elev/date-elev.component';
import { GrupeComponent } from './grupe/grupe.component';
import { HomeComponent } from './home/home.component';
import { ManagementComponent } from './management/management.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    children:[
      {path: 'grupe', component: GrupeComponent},
      {path: 'management', component: ManagementComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'dateelev', component: DateElevComponent}
    ]
  },
  {path: "**",component: HomeComponent, pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
