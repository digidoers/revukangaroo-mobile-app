import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { tap, map, switchMap, finalize, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';
import { AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';

const STORAGE_REQ_KEY = 'storedreq';
const API_STORAGE_KEY = 'CLAVAL';

interface StoredRequest {
  url: string,
  type: string,
  data: any,
  time: number,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
 
  public db_created = 0;
  public tx;


  constructor( private _errorService: ErrorService,
    private platform: Platform,
    private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController
    ) {
       
     }


         //offline save Remember me

      //Store and fetch Offline data

      saveUserLogin(data){
        let temp_query = "";
        let promises = [];
        data = JSON.stringify(data);
        this.storage.set(`revu_remeber_me`, data).then((res) => {});
      }

       async getUserLogin() {
        let thiss = this;
        var promise1 = new Promise(function(resolve, reject) {
            thiss.storage.get(`revu_remeber_me`).then((res) => {
                resolve(JSON.parse(res));
            }).catch(err => {
                
              });
        });
        return await promise1;
      }


}
