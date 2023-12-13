import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthtenticated = false

  constructor(private dataStorageService: DataStorageService,
              private authUser: AuthService){}

  ngOnInit(): void {
      this.authUser.user.subscribe(user =>
        //update authtentication state
        this.isAuthtenticated = !!user
      )
  }

  storageData(){
    this.dataStorageService.storageData()
  }

  fetchData(){
    this.dataStorageService.fetchData().subscribe()
  }

  onLogout(){
    this.authUser.logout()
  }

}
