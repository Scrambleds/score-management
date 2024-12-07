import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgGridComponent } from './components/ag-grid/ag-grid.component';

const routes: Routes = [
  // { path: '', component: LandingComponent },
  // { path: 'product/insert', component: InsertComponent },
  { path: 'list', component: AgGridComponent },
  // { path: 'chat', component: ChatComponent },
  // { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
