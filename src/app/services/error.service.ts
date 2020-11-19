import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
 	displayerrors: any;
  constructor(private toastController: ToastController,) { }


   public handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    
    return Promise.reject(error);
  }

  public displayError(res: any) {

    if(res.status == 401){
      let toast = this.toastController.create({
          message: 'Session Expired!! Please login again',
          duration: 5000,
          position: 'bottom'
         });
         toast.then(toast => toast.present());
    }

    if (res.error.error || res.error) {
   
      this.displayerrors = res.error;
      // console.log(res.error.error.password.length);
      if (res.error.password) {
        res.error.password.forEach(element => {

         let toast = this.toastController.create({
          message: 'Error Code - ' + res.error.code,
          duration: 5000,
          // position: 'bottom'
         });
         toast.then(toast => toast.present());

         //this.toastr.error(element, 'Error Code - ' + res.error.code);
        });
      } else if (res.error.email) {
       
        res.error.email.forEach(element => {

           let toast = this.toastController.create({
          message: 'Error Code - ' + res.error.code,
          duration: 5000,
          // position: 'bottom'
         });
         toast.then(toast => toast.present());

        });
      } else {
        const isNested = Object.keys(res.error).some(function (key) {
          return res.error[key] && typeof res.error[key] === 'object';
        });
        if (isNested) {
     
          for (const key in res.error.errors) {
            if (res.error.errors[key]) {
			       let toast = this.toastController.create({
				      message:  res.error.errors[0],
				    duration: 5000,
				// position: 'bottom'
				    });
				toast.then(toast => toast.present());
              //this.toastr.error(res.error[key], 'Error Code - ' + res.error.code);
            }
          }
        } else {
          if(res.error.errors != '' && res.error.errors){
    			let toast = this.toastController.create({
    			  message:  res.error.errors,
    			  duration: 5000,
    			// position: 'bottom'
    			});
    			toast.then(toast => toast.present());
              //this.toastr.error(res.error, 'Error Code - ' + res.error.code);
          }
      }

      }
    } else if (res.error.message) {

      if (res.error.code !== 422) {
      	let toast = this.toastController.create({
			message:  'Error Code - An error occured, please contact system adminsitrator ',
			duration: 5000,
			// position: 'bottom'
			});
			toast.then(toast => toast.present());
      
      } else {
      		let toast = this.toastController.create({
			message:  res.error.errors.message,
			duration: 5000,
			// position: 'bottom'
			});
			toast.then(toast => toast.present());
      }
    }
  }
}
