import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { FormEditComponent } from './components/form-edit/form-edit.component';
import { MasterDataComponent } from './route/master-data/master-data.component';
import { UserManageComponent } from './route/user-manage/user-manage.component';
import { ScoreAnnouncementComponent } from './route/score-announcement/score-announcement.component';
import { UploadScoreComponent } from './route/upload-score/upload-score.component';
import { SearchScoreComponent } from './route/search-score/search-score.component';
import { DashboardComponent } from './route/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: ScoreAnnouncementComponent },
  { path: 'MasterData', component: MasterDataComponent },
  { path: 'UserManagement', component: UserManageComponent },
  { path: 'UploadScore', component: UploadScoreComponent },
  { path: 'SearchScore', component: SearchScoreComponent },
  { path: 'ScoreAnnouncement', component: ScoreAnnouncementComponent },
  { path: 'Dashboard', component: DashboardComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
