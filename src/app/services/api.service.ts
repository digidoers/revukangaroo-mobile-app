import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable, from, of } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { format } from 'url';
import {Storage} from '@ionic/storage';

const API_STORAGE_KEY = 'REVU';
const API_URL = 'http://revukangaroo.local.com/api';
const IS_SQL_LITE_ENABLE =  true;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public loading :any;
  public loading1 :any;
  constructor(
    private _authenticationService: AuthenticationService,
    private _errorService: ErrorService,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public alertController: AlertController) { }


    // Save result of API requests
  private setLocalData(key, data) {
    key = key.replace(' ', '-');
  this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
}

// Get cached API result
private getLocalData(key) {
    key = key.replace(' ', '-');
  return this.storage.get(`${API_STORAGE_KEY}-${key}`);
}

//Show Loader
async showLoader()
{
  console.log("showLoader");
  
  this.loading =  await this.loadingCtrl.create({
  message: "wait",
  spinner: 'crescent',
  duration:3000
});
//console.log("showLoader");
  return await this.loading.present();
}
//Dismiss Loader
async dismissLoader()
{
 console.log("dismissLoader");
 this.loading.dismiss();
}

//Show Loader
async showLoader1()
{
 this.loading1 = await this.loadingCtrl.create({
  message: 'wait',
  duration:1000000
});

return await this.loading1.present();
//    this.loading1 =  await this.loadingCtrl.create({
//    message: 'Please wait...',
//    spinner: 'crescent',
//  });
//    return await this.loading1.present();
}
//Dismiss Loader
async dismissLoader1()
{
await this.loading1.dismiss();
}

 
private handleError(error: any) {
  let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  return Observable.throw(error);
}

}
