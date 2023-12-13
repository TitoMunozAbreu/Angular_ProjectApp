import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true
  isLoading = false
  error = null

  constructor(private authService: AuthService,
              private route: Router){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(authForm: NgForm) {    
    const email = authForm.value.email
    const password = authForm.value.password
    //display loading
    this.isLoading = true
    //store observable
    let authObs: Observable<AuthResponseData>

    if(this.isLoginMode){
        //auth user registered
      this.authService.login(email, password)   
    }else {
       //auth register
      this.authService.signUp(email, password ).subscribe({
        next: value => {
          console.log(value);        
          this.isLoading = false
          this.route.navigate(['/recipes'])
        },
        error: errorMessage => {            
          this.isLoading = false
          this.error = errorMessage
        }    
      })  
    }
    //limpiar formulario
    authForm.reset()

  
      
  }
}
