import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { FormEditComponent } from './components/form-edit/form-edit.component';


const routes: Routes = [
  { path: 'edit', component: EditUserComponent },
  { path: 'form', component: FormEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
