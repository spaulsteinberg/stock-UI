import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-gains-landing',
  templateUrl: './my-gains-landing.component.html',
  styleUrls: ['./my-gains-landing.component.css']
})
export class MyGainsLandingComponent implements OnInit {

  constructor( private el: ElementRef) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightblue"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
   }

  ngOnInit(): void {
  }

}
