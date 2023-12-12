import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  constructor(private dataStorageService: DataStorageService){}
  subsciption = new Subscription

  success = false
  warning = false
  info = false
  danger = false
  message = ''
  
  ngOnInit(): void {
    this.subsciption = this.dataStorageService.dataChanged.subscribe(
      data => {
        if(data){
          this.success = data
          this.message = 'Data saved susccessfully'
        }else {
          this.danger = true
          this.message = 'Data not saved!'
        }
      }
    )
  }

  onClose(){
    this.success = false
    this.warning = false
    this.info = false
    this.danger = false
    this.message = ''
  }

  ngOnDestroy(): void {
    this.subsciption.unsubscribe;
  }

}
