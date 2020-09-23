import { Component, OnInit } from '@angular/core';
import { RegisterUserService } from 'src/app/shared/services/register-user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public _auth: RegisterUserService) { }

  ngOnInit(): void {
  }

}
