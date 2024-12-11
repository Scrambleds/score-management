import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
   username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Check token expiration on direct access to login page
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const redirectUrl = this.activatedRoute.snapshot.queryParams['redirectUrl'] || '/Dashboard'; // Use activatedRoute


    if (token && tokenExpiration && new Date() < new Date(tokenExpiration)) {
      const redirectPath = localStorage.getItem('redirectPath') || '/Dashboard';
      this.router.navigate([redirectPath]); // Redirect to a specific path if token is valid
    }
  }

  onLogin() {
    const loginData = {
      username: this.username,
      password: this.password,
    };

    this.http.post(`${environment.apiUrl}/api/User/GetToken`, loginData).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          const token = response.tokenResult.token;
          const expiration = new Date(response.tokenResult.expiration);
          localStorage.setItem('token', token);
          localStorage.setItem('tokenExpiration', expiration.toISOString());
          const redirectUrl = this.activatedRoute.snapshot.queryParams['redirectUrl'] || '/Dashboard';
          
          // Ensure NavigationEnd is triggered after successful login
          this.router.navigate([redirectUrl]).then(() => {
            // After navigating, the NavigationEnd event will be fired, and top-nav will receive it
            console.log('Successfully navigated to:', redirectUrl);
          });
        } else {
          this.errorMessage = response.message.messageDescription;
        }
      },
      (error) => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    );
  }

  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('tokenExpiration');
    if (expiration) {
      return new Date() > new Date(expiration);
    }
    return true;
  }
}
