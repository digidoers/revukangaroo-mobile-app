import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastController, LoadingController, MenuController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
const API_STORAGE_KEY = "REVU";
const API_URL = "https://staging.revukangaroo.com/api";

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"],
})
export class MessagePage implements OnInit {
  constructor(
    private menu: MenuController,
    private httpClient: HttpClient,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  public loading: any;
  public templates: any;
  ngOnInit() {
    this.showLoader();
    this.httpClient
      .get(`${API_URL}/template-list`, this.jwt()
      )
      .toPromise()
      .then((res) => {
        this.dismissLoader();
        // this.presentToast("Error : " + res['msg']);
        console.log("res template list", res);
        if (res['status']) {
          if(res['data'].length > 0){
            this.templates = res['data'][0].sms_message;
            console.log("templates", this.templates);
          }
        } else {
          this.removeStorage();
          if(res['is_verify']){
            this.presentToast("Error : " + res['msg']);
          } else {
            this.removeStorage();
            this.router.navigate(['home']);
          }
        }
      });
      
  }

  initializeApp() {
    alert("initializeApp");
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
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

  public jwt() {
    const currentUser = localStorage.getItem("TOKEN_KEY");   
    if (currentUser) {
      console.log("currentUser", currentUser);
      const httpOptions = {
        headers: new HttpHeaders({
            'token': currentUser
        })
      };
      return httpOptions;
    }
  }

  removeStorage(){
    localStorage.removeItem('TOKEN_KEY');
  }

  sendMessage(form) {
    console.log("send message", form);
    this.showLoader();
    console.log("form ", form.value);
    this.httpClient
      .post(`${API_URL}/send-sms`, {
        phone: form.value["phone"],
        text: this.templates,
      }, 
      this.jwt()
      )
      .toPromise()
      .then((res) => {
        this.dismissLoader();
        if (res['status']) {
          localStorage.setItem("mnumber", form.value["phone"]);
          form.reset();
          //this.presentToast("Success : " + res['msg']);
          
          this.router.navigate(['thank-you']);
        } else {
          if(res['is_verify']){
            this.presentToast("Error : " + res['msg']);
          } else {
            this.removeStorage();
            this.router.navigate(['home']);
          }          
        }
      });
  }

  numberOnlyValidation(event: any) {
    console.log("event", event.target.value);
    // const pattern = /[0-9,]/; // without ., for integer only
    // let inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);

    // if (!pattern.test(inputChar)) {
    //   // invalid character, prevent input
    //   event.preventDefault();
    //   return false;
    // }
    // return true;

  //   const pattern = /[0-9,]/;
  //   let inputChar = String.fromCharCode(event.charCode);
  //  // event.preventDefault();
  //   return false;
  //   console.log("inputChar", event.target.value);

  //   if (!pattern.test(inputChar)) {
  //     // invalid character, prevent input
      
  //     alert("invaild");
  //     //return false;
  //   } else {
  //     alert("this is vaild");
  //     //return true;
  //   }
  }

}
