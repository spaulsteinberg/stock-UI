import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteDirect } from 'src/app/shared/services/utilities/RouteEnum';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.css']
})
export class InteractiveComponent implements OnInit {

  constructor(public utils: UtilsService, public route: ActivatedRoute, private el: ElementRef) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightblue"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
   }

  ngOnInit(): void {
  }
  
  public direct = RouteDirect.VISUAL;

}
