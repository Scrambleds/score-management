import { Component } from '@angular/core';

@Component({
  selector: 'app-score-announcement',
  standalone: false,

  templateUrl: './score-announcement.component.html',
  styleUrl: './score-announcement.component.css',
})
export class ScoreAnnouncementComponent {
  //สำหรับตัวอย่าง response ของ language
  jsonString = JSON.stringify(
    {
      isSuccess: false,
      message: {
        messageKey: '',
        messageDescription: '',
      },
      objectResponse: {
        welcome_message: 'Welcome {username}',
        logout: 'Logout',
        home: 'Home',
        insert_product: 'Insert a Product',
        language: 'Language',
        list: 'List',
        login: 'Login',
        login_user_not_found: '{username} not found',
        login_success: 'Welcome {username}',
        login_failed: 'username / password incorrect',
        chat: 'Chat',
        noti_template1:
          'There was an error sending. email to {student_name}\\ndetail : {error_detail}',
        menu_masterdata: 'Master Data management',
        menu_usermanage: 'User management',
        menu_uploadscore: 'Import student scores',
        menu_searchscore: 'Search score',
        menu_scoreannounce: 'Score announcements',
        menu_dashboard: 'Dashboard',
      },
    },
    null,
    2
  ); // Null, 2 for pretty-printing
}
