import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Shorts @environments parecidos a los de Angular
// Los shorts están configurados en el archivo tsconfig.json
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
  ) { }

  // login method for email and password sending
  // Receives email and password
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/login`, {
      email,
      password
    });
  }
  // Register method for valid email, 8 or more characters password, and name
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, {
      email,
      password,
      name
    });
  }
  // Verify if email exist or not
  isAvailable(email: string) {
    return this.http.post<{ isAvailable: boolean }>(`${this.apiUrl}/api/v1/auth/is-available`, { email });
  }

}
