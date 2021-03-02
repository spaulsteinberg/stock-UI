import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private el: ElementRef, private router: Router) {
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "url('../assets/general-images/nasdaq-nums.jpg')";
   }

  DIMENSION_HEIGHT:number = window.screen.height * .65;
  clicked:boolean = false;
  style = {
    'height': `${this.DIMENSION_HEIGHT}px`
  };

  imgStyle = { 'max-height': `${window.screen.height * .208}px`, 'min-height': `${window.screen.height * .208}px`}

  
  scrollDown = () => {
    this.clicked = !this.clicked;
    window.scroll({
      top: this.clicked ? window.screen.height : 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  // on manual reload reset view to the top of the page
  @HostListener('window:beforeunload') goToPage() {
    window.scroll({
      top: 0,
      left: 0
    })
  }

  nav = () => this.router.navigate(['/register']);

  ngOnInit(): void {
  }

  ngAfterViewInit(){
  }

}
