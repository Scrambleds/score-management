import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { FormEditComponent } from './components/form-edit/form-edit.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MasterDataComponent } from './route/master-data/master-data.component';
import { UserManageComponent } from './route/user-manage/user-manage.component';
import { SearchScoreComponent } from './route/search-score/search-score.component';
import { UploadScoreComponent } from './route/upload-score/upload-score.component';
import { ScoreAnnouncementComponent } from './route/score-announcement/score-announcement.component';
import { DashboardComponent } from './route/dashboard/dashboard.component';

import { provideHttpClient } from '@angular/common/http';
import { TranslatePipe } from './shared/pipes/translate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EditUserComponent,
    FormEditComponent,
    SideNavComponent,
    TopNavComponent,
    FooterComponent,
    MasterDataComponent,
    UserManageComponent,
    SearchScoreComponent,
    UploadScoreComponent,
    ScoreAnnouncementComponent,
    DashboardComponent,
    TranslatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    AgGridAngular,
    CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    NgIf,
    FormsModule,
    NgSelectModule,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
    MatSelectModule,
  ],
  providers: [
    provideHttpClient(),
    // provideClientHydration(withEventReplay()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
