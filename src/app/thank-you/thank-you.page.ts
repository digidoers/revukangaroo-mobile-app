import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
})
export class ThankYouPage implements OnInit {

  constructor() { }

  public mnumber: any;

  ngOnInit() {
    this.mnumber = localStorage.getItem("mnumber");
  }

}
