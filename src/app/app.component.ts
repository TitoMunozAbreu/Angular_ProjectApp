import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/compat/app'
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.autoLogin()

    firebase.initializeApp({
        apiKey: "AIzaSyCM5Yp19jT9cY9K7yOAnMehIq6Mycj5Wko",
        authDomain: "papaya-api-v1.firebaseapp.com",
    })
  }
}
