import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "url('../assets/general-images/nasdaq-nums.jpg')"
  }
}
