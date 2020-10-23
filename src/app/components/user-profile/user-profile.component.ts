import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User = null;

  constructor(private userService: UserService) {
    this.userService.getUserInfo().subscribe((info) => (this.user = info));
  }

  ngOnInit(): void {}
}
