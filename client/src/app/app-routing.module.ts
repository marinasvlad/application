import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { EleviComponent } from './elevi/elevi.component';
import { GrupeComponent } from './grupe/grupe.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    children:[
      {path: 'grupe', component: GrupeComponent},
      {path: 'elevi', component: EleviComponent},
      {path: 'contact', component: ContactComponent}
    ]
  },
  {path: "**",component: HomeComponent, pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
