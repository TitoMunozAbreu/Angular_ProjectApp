import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, enableProdMode } from "@angular/core";
import { BehaviorSubject, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";

import firebase from "firebase/compat/app"; 
import 'firebase/compat/auth';
import { Router } from "@angular/router";

export interface AuthResponseData{
    kind?: string
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered?: boolean
}

@Injectable({providedIn:"root"})
export class AuthService {
    private singUpURL = '/v1/accounts:signUp?key=AIzaSyCM5Yp19jT9cY9K7yOAnMehIq6Mycj5Wko'
    expirationDurationTimer: any

    user = new BehaviorSubject<User>(null)
    private token: string


    constructor(private http: HttpClient,
                private route: Router){}
    
    signUp(email: string, password: string){       
        return this.http.post<AuthResponseData>(this.singUpURL,
                                {
                                    email: email,
                                    password: password,
                                    returnSecureToken: true
                                })
                        .pipe(catchError(this.handleError),
                                tap(resData => {
                                    this.handleAuhtentication(
                                        resData.email,
                                        resData.localId,        
                                        resData.idToken,
                                        +resData.expiresIn
                                    )                                                                        
                                }))
    }

    autoLogin(){
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'))
        if(!userData){
            return
        }

        const loaderUser = new User(userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)) 
            
        if(loaderUser.token){
            this.user.next(loaderUser)
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() -
                                            new Date().getTime()
            this.autoLogout(expirationDuration)
        }
    }

    login(email: string, password:string){        
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then(
            authResp => {
                firebase.auth().currentUser?.getIdToken().then(
                    token => {
                        this.token = token
                        this.handleAuhtentication(
                            email,
                            authResp.user.uid,
                            token,
                            1000
                        )                                       
                    }
                )
            }
        )
    }
    logout(){
        this.user.next(null)
        this.route.navigate(['/auth'])
        //clean user when logging out
        localStorage.removeItem('userData')
        
        if(this.expirationDurationTimer){
            clearTimeout(this.expirationDurationTimer)
        }
        this.expirationDurationTimer = null
    }

    autoLogout(expirationDuration: number){     
        this.expirationDurationTimer = setTimeout(() => {
            this.logout()
        },360000)
    }  


    private handleAuhtentication(
        email: string,
        userId: string,
        token: string,
        expiresIn?: number
    ){
        //establish the expiration date
        const expirationDate = new Date(new Date().getTime())
        expirationDate.setHours(expirationDate.getMilliseconds() + 3600000)
        //create user
        const newUser = new User(email, userId, token, expirationDate)        
        //notify to the subject
        this.user.next(newUser)
        this.autoLogout(expiresIn)
        localStorage.setItem('userData', JSON.stringify(newUser))
        //redirect user to recipe
        this.route.navigate(['/recipes']) 

        
    }

    private handleError(errorResp: HttpErrorResponse){           
        let errorMessage = 'An unknown error occured!'
        if(!errorResp.error || !errorResp.error.error ){
            return throwError(() => new Error(errorMessage))
        }
        switch(errorResp.error.error.message){
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email not found'
                break
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid password'
                break
            case 'USER_DISABLED':
                errorMessage = 'User disabled'
                break
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Invalid email and password'
                break
        }
        return throwError(() => new Error(errorMessage))
    }

    
    //FIREBASE AUTH UDEMY VERSION 
   /*  login(email: string, password: string){
        return this.http.post<AuthResponseData>(this.loginURL,
                                {
                                    email: email,
                                    password: password,
                                    returnSecurityToken: true
                                })
                        .pipe(catchError(this.handleError),
                                tap(resData => {
                                    this.handleAuhtentication(
                                        resData.email,
                                        resData.localId,
                                        resData.idToken,
                                        +resData.expiresIn
                                    )
                                }))
    } */
}