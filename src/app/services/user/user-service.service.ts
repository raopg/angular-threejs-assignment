import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  USER_INFO_URL: string = 'http://localhost:4200/assets/user.json';
  getUserInfo = () => {
    return this.http.get<User>(this.USER_INFO_URL);
  };
}
