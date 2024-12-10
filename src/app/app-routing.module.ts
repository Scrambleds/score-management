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
  {
    path: '',
    // component: ScoreAnnouncementComponent,
    // data: { messageKey: 'menu_scoreannounce' },
    redirectTo: '/ScoreAnnouncement', // กำหนดให้เปลี่ยนเส้นทางไปที่ ScoreAnnouncement
    pathMatch: 'full',
  },
  {
    path: 'MasterData',
    component: MasterDataComponent,
    data: { messageKey: 'menu_masterdata' },
  },
  {
    path: 'UserManagement',
    component: UserManageComponent,
    data: { messageKey: 'menu_usermanage' },
  },
  {
    path: 'UploadScore',
    component: UploadScoreComponent,
    data: { messageKey: 'menu_uploadscore' },
  },
  {
    path: 'SearchScore',
    component: SearchScoreComponent,
    data: { messageKey: 'menu_searchscore' },
  },
  {
    path: 'ScoreAnnouncement',
    component: ScoreAnnouncementComponent,
    data: { messageKey: 'menu_scoreannounce' },
  },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    data: { messageKey: 'menu_dashboard' },
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
