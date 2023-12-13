import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";

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
    private loginURL = '/v1/accounts:signInWithPassword?key=AIzaSyCM5Yp19jT9cY9K7yOAnMehIq6Mycj5Wko'

    user = new Subject<User>


    constructor(private http: HttpClient){}
    
    signUp(email: string, password: string){
        //send http request
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

    login(email: string, password: string){
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
    }

    private handleAuhtentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ){
        
        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000))
        console.log(expirationDate);
        
        const user = new User(email, userId, token,expirationDate)
        console.log('user data');
        console.log(user);
        
        this.user.next(user)
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
}