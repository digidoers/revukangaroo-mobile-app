import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastController, LoadingController } from "@ionic/angular";
import { ActivatedRoute, Router } from '@angular/router';

const TOKEN_KEY = "authToken";
const API_URL = "https://staging.revukangaroo.com/api";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  private headers = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  });
  public loading: any;
  constructor(
    private httpClient: HttpClient,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const currentUser = localStorage.getItem("TOKEN_KEY"); 
    if(currentUser){
      this.router.navigate(['message']);
    }
    
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
    });
    toast.present();
  }

  //Show Loader
  async showLoader() {
    console.log("showLoader");

    this.loading = await this.loadingCtrl.create({
      message: "wait",
      spinner: "crescent",
      duration: 10000,
    });
    //console.log("showLoader");
    return await this.loading.present();
  }
  //Dismiss Loader
  async dismissLoader() {
    console.log("dismissLoader");
    this.loading.dismiss();
  }

  login(form) {
    this.showLoader();
    console.log("form ", form.value);
    // return true;
    this.httpClient
      .post(`${API_URL}/login`, {
        email: form.value["email"],
        password: form.value["password"],
      })
      .toPromise()
      .then((res) => {
        this.dismissLoader();
        if (res['status']) {
          this.presentToast("Success : " + res['msg']);
          localStorage.setItem("TOKEN_KEY", res["data"].token);
          // this.route.navigate(['/home']);
          this.router.navigate(['message']);
        } else {
          this.presentToast("Error : " + res['msg']);
        }
      });
  }

  saveUserLogin(data){
    data = JSON.stringify(data);
    localStorage.setItem(`revu_remeber_me`, data);
  }

  getUserLogin() {
    localStorage.getItem('revu_remeber_me');
  }
}
