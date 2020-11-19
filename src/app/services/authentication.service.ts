import {Platform} from '@ionic/angular';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable, from, BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http'; 
import {CommonService} from './common.service';
import {promise} from 'protractor'; 

const TOKEN_KEY = 'authToken';
const API_URL = 'http://revukangaroo.local.com/api';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    authenticationState = new BehaviorSubject(false);
    private headers = new HttpHeaders({'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'});

    public token: string;


    constructor(private storage: Storage, private plt: Platform, private httpClient: HttpClient,
                private commonService: CommonService 
    ) {
        this.plt.ready().then(() => {
            this.checkToken();
        });
    }

    checkToken() {
        this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                this.authenticationState.next(true);
            }
        });
    }

    myProfile(): Promise<any> {
        console.log('My Profile:'); 
            console.log('Connection status is offline.');
            return this.httpClient
                .get(`${API_URL}accounts/my-profile`, {headers: this.jwt()})
                .toPromise()
                .then((res) => {
                    console.log('myprofile', JSON.stringify(res['data']));
                    this.storage.set('userData', res['data']); 

                })
                .catch(this.handleError);
        
    }


    getUser() {
        return this.storage.get('userData');
    }

    // login() {
    //   return this.storage.set(TOKEN_KEY, 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImJ5dGVsYXVuY2hAbGluazJ2YWx2ZXMuY29tIiwibmJmIjoxNTY0OTI3OTA3LCJleHAiOjE1NjQ5MzUxMDcsImlhdCI6MTU2NDkyNzkwNywiaXNzIjoiQ2xhLVZhbCBNb2JpbGUgQXBwIEFQSSIsImF1ZCI6IkNsYS1WYWwgTW9iaWxlIEFwcCBBUEkifQ.C9TOBeiOJzi62g5QqWW5Om_Gc3UkddT6VvUtvUyDbH5gdrH2Ap9aFHX3uqZXY9gXcXbvhWsBLyHC1-LAC5uy9Q').then(() => {
    //     this.authenticationState.next(true);
    //   });
    // }

    login(email: string, password: string, rememberMe: boolean): Promise<any> {

        return this.httpClient
            .post(`${API_URL}/login`,
                JSON.stringify({email: email, password: password}),
                {headers: this.headers})
            .toPromise()
            .then((res) => {
                // alert(res['data'].token)
                console.log("res after success 1", res);
                if (res) {
                    console.log("res after success", res);
                    if (rememberMe) {
                        let userdetails = JSON.stringify({email: email, password: password}); 
                        this.commonService.saveUserLogin(userdetails); 
                    }
                    console.log('revu: auth login', JSON.stringify(res['data']));
                    try {

                        localStorage.setItem('TOKEN_KEY', res['data'].token);
                    } catch (err) {

                        console.log('revu: error', err);
                    }
                    console.log('revu: set auth login', JSON.stringify(res['data']));

                    console.log('revu: TOKEN_KEY', TOKEN_KEY);
                    console.log('revu: res[\'data\'].token', res['data'].token);

                    // set a key/value
                    this.storage.set('name', 'Max');
                    console.log('revu: set name to', 'Max');

                    // Or to get a key/value pair
                    this.storage.get('name').then((val) => {
                        console.log('revu: Your age is', val);
                    });


                    // this.storage.set('authToken', res['data'].token);
                    // console.log('revu:  this.storage.set(TOKEN_KEY...');
                    // this.storage.get('authToken').then((val) => {
                    //     console.log('revu: ====== TOKEN_KEY is', val);
                    // });


                    return this.storage.set('authToken', res['data'].token).then(() => {
                        console.log('revu: about to myProfile');
                        this.myProfile();
                        console.log('revu: done myProfile');
                        this.authenticationState.next(true);
                    }).catch((err) => {
                        console.log('revu: set storage err', err);

                    });
                }
            })
            .catch(this.handleError);
    }

    logout() {
        return this.storage.remove(TOKEN_KEY).then(() => {
            localStorage.removeItem('TOKEN_KEY');
            this.authenticationState.next(false);
        });
    }

    saveRememberMe(userdetails) {
        this.storage.set('userLogin', userdetails);
    }


    forgetMe() {
        this.storage.remove('userLogin');
    }

    getRememberMe(): Promise<any> {
        let data = this.commonService.getUserLogin().then(async function(data) {
            return await data;
        });
        return data;
        //console.log('offline',data)
        // Convert Promise data to Observable
        //return from(data);
        // let userLogin = this.storage.get('userLogin');
        // return userLogin;
    }

    isAuthenticated() {
        return this.authenticationState.value;
    }

    public handleError(error: any): Promise<any> {
        //console.log("error.status ", error);
        console.error('revu: An error occurred', JSON.stringify(error)); // for demo purposes only
        if(error.error.errors && error.error.errors[0]){
            return Promise.reject(error.error.errors[0] || error);
        } else {
            return Promise.reject('Error code 429: Too many requests');
        }
        
        //return Promise.reject(error.error.errors[0] || error);
    }

    // private helper methods
    public jwt() {
        // create authorization header with jwt token

        if (this.storage.get(TOKEN_KEY) != null) {
            let currentUser;
            this.storage.get(TOKEN_KEY).then((data) => {
                // alert(data)
                localStorage.setItem('TOKEN_KEY', data);
            });
            // alert(localStorage.getItem("TOKEN_KEY"))
            if (localStorage.getItem('TOKEN_KEY')) {

                //const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem("TOKEN_KEY"),'Content-Type': 'application/json'});
                const headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('TOKEN_KEY')});

                return headers;
            }
        } else {
            const currentUser = sessionStorage.getItem('TOKEN_KEY');
            if (currentUser) {
                const headers = new HttpHeaders({'Authorization': 'Bearer ' + currentUser});
                return headers;
            }
        }
    }

    public jwtOffline() {
        // create authorization header with jwt token

        if (this.storage.get(TOKEN_KEY) != null) {
            let currentUser;
            this.storage.get(TOKEN_KEY).then((data) => {
                // alert(data)
                localStorage.setItem('TOKEN_KEY', data);
            });
            // alert(localStorage.getItem("TOKEN_KEY"))
            if (localStorage.getItem('TOKEN_KEY')) {

                const headers = new HttpHeaders({
                    'Authorization': 'Bearer ' + localStorage.getItem('TOKEN_KEY'),
                    'Content-Type': 'application/json'
                });
                //const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem("TOKEN_KEY")});

                return headers;
            }
        } else {
            const currentUser = sessionStorage.getItem('TOKEN_KEY');
            if (currentUser) {
                const headers = new HttpHeaders({'Authorization': 'Bearer ' + currentUser});
                return headers;
            }
        }
    }

}
