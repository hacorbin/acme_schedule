import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LocationsService } from './services/locations.service';
import { SchedulesService } from './services/schedules.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import {FormsModule} from '@angular/forms';

import {GenericTableModule} from "angular-generic-table";

const appRoutes: Routes = [
  { path: '', redirectTo: 'schedules', pathMatch: 'full' },
  { path: 'schedules', component: SchedulesComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SchedulesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    GenericTableModule
  ],
  providers: [LocationsService, SchedulesService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
