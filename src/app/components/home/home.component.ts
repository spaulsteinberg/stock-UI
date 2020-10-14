import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private el: ElementRef) {
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "url('../assets/general-images/nasdaq-nums.jpg')"
  }

}
