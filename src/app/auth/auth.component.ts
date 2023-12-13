import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true
  isLoading = false
  isAuthtenticated = false
  error = null

  constructor(private authService: AuthService){}

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
      authObs = this.authService.login(email, password)            
    }else {
       //auth register
      authObs = this.authService.signUp(email, password )         
    }
    //limpiar formulario
    authForm.reset()
    //subscribe the result
    authObs.subscribe({
      next: value => {
        this.isLoading = false
        this.isAuthtenticated = true     
      },
      error: errorMessage => {
        this.isLoading = false
        this.error = errorMessage
      }
    })
      
  }
}
