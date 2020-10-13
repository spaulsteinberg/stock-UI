import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef) {
   }

  ngOnInit(): void {
    this.renderer.removeStyle(document.body, 'background-image');
  }

}
