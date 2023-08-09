import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  SignupResponse,
} from 'src/app/shared/model/authResponse.model';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.base_url;

  constructor(
    private http: HttpClient,
    private storage: SessionStorageService
  ) {}

  register(credentials: {
    username: string;
    password: string;
  }): Observable<SignupResponse> {
    return this.http.post<SignupResponse>('/api/signup', credentials);
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<AuthResponse> {
    const url = `${this.baseUrl}/login`;

    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.storage.set('access_token', response.token);
        }
      })
    );
  }

  getToken(): string {
    return this.storage.get('access_token');
  }

  logout(): void {
    this.storage.delete('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.storage.get('access_token');
  }
}
