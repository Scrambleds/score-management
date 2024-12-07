import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { CommonModule } from '@angular/common';
import { AgGridComponent } from './components/ag-grid/ag-grid.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    AgGridComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    AgGridAngular,
    CommonModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
